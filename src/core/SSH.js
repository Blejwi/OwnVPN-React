import NodeSSH from "node-ssh";
import fs from "fs";
import {remote} from "electron";
import {add as addLog} from "../actions/logs";
import * as LOG from "../constants/logs";


const cert_directory = '~/openvpn-ca';
const vars_file = `${cert_directory}/vars`;
const cert_begin = `cd ${cert_directory} && source ${vars_file}`;

const clean_all = `${cert_directory}/clean-all`;
const build_ca = `${cert_directory}/pkitool --initca`;
const build_key_server = `${cert_begin} && ${cert_directory}/pkitool --batch --server server`;

const build_dh = `${cert_begin} && ${cert_directory}/build-dh`;
const build_hmac = `openvpn --genkey --secret ${cert_directory}/keys/ta.key`;
const all_keys = `ca.crt ca.key server.crt server.key ta.key dh2048.pem`;
const copy_keys = `cd ${cert_directory}/keys && sudo cp ${all_keys} /etc/openvpn`;
const check_keys = `cd ${cert_directory}/keys && ls ${all_keys}`;


const generate_client_key = `${cert_directory}/pkitool --batch`;
const conf_file = `/etc/openvpn/server.conf`;
const client_conf_base_file = `~/client-configs/base.conf`;
const client_keys_dir = `~/openvpn-ca/keys`;
const client_output_dir = `~/client-configs/files`;
let ccd_dir = '/etc/openvpn/ccd'; // it should be able to reassigned by server configuration

export default class SSH {
    constructor(dispatch, server) {
        this.dispatch = dispatch;
        this.server = server;
        this._ssh = new NodeSSH();

        this.config = {
            host: server.host,
            port: server.port,
            username: server.username
        };

        if (server.key) {
            this.config.privateKey = fs.readFileSync(server.key, 'utf-8', 'r');
        }

        if (server.password) {
            this.config.password = server.password;
        }

        this.connection = this._ssh.connect(this.config).catch((e) => {
            return Promise.reject(this.defaultError(e));
        });
    }

    log(msg, level) {
        this.dispatch(addLog(msg, level, 'SSH'));
    }

    setup_server() {
        this.log('Starting setup_server', LOG.LEVEL.INFO);

        return new Promise((resolve, reject) => {
            this.connection
                .then(() => {
                    return this.aptGetUpdate()
                        .then(() => this.aptGetInstall())
                        .then(() => this.makeCADir())
                        .then(() => this.configureCAVars())
                        .then(() => this.generateServerKeys())
                        .then(() => this.copyKeys())
                        .then(() => this.uploadServerConfig())
                        .then(() => this.enable_ip_forward())
                        .then(() => this.configure_firewall())
                        .then(() => this.start_openvpn())
                        .then(() => this.setup_client_infrastructure())
                        .then(resolve)
                        .catch((e) => {
                            this.log('Something failed...', LOG.LEVEL.ERROR);
                            this.log(e, LOG.LEVEL.ERROR);
                            reject(e);
                        });
                })
                .catch((e) => reject(e));
        });
    }

    setup_client({id, ipAddress}) {
        this.log('Starting setup_client', LOG.LEVEL.INFO);

        return new Promise((resolve, reject) => {
            this.connection
                .then(() => {
                    return this._runCommand(`ls ${client_keys_dir}/${id}.key`, {}, false)
                        .then((response) => {
                            if (response.code === 0) {
                                // Cert with given name exists
                                this.log(`Key with name ${id} already exists`, LOG.LEVEL.ERROR);
                                if (confirm(`Key with name ${id} already exists. Do you want to regenerate it?`)) {
                                    return this._runCommand(`rm ${client_keys_dir}/${id}.key`)
                                        .then(() => this.generateClientKey(id))
                                        .then(() => this.generateClientConfigFiles(id)
                                        .then(() => this.bindClientIp(id, ipAddress)));
                                }
                                throw response;
                            } else if (response.code === 2) {
                                return this.generateClientKey(id)
                                    .then(() => this.generateClientConfigFiles(id)
                                    .then(() => this.bindClientIp(id, ipAddress)));
                            } else {
                                throw response;
                            }
                        })
                })
                .then(resolve)
                .catch((e) => {
                    this.log('Something failed...', LOG.LEVEL.ERROR);
                    this.log(e, LOG.LEVEL.ERROR);
                    reject(e);
                });
        });
    }

    generateServerKeys() {
        return this._runCommand(`${check_keys}`, {}, false).then((response) => {
            if (response.code === 0) {
                if (confirm('Server keys already exists. Do you want to regenerate them?')) {
                    return this._generateServerKeys();
                } else {
                    return;
                }
            }
            return this._generateServerKeys();
        });
    }

    _generateServerKeys() {
        return this.cleanAll()
            .then(() => this.buildCA())
            .then(() => this.buildKeyServer())
            .then(() => this.buildDH())
            .then(() => this.buildHMAC());
    }

    generateClientKey(id) {
        return this._runCommand(
            `${cert_begin} && ${generate_client_key} ${id}`
        );
    }

    generateClientConfigFiles(id) {
        return this._runCommand(
            `cat ${client_conf_base_file} \
            <(echo -e '<ca>') \
            ${client_keys_dir}/ca.crt \
            <(echo -e '</ca>\n<cert>') \
            ${client_keys_dir}/${id}.crt \
            <(echo -e '</cert>\n<key>') \
            ${client_keys_dir}/${id}.key \
            <(echo -e '</key>\n<tls-auth>') \
            ${client_keys_dir}/ta.key \
            <(echo -e '</tls-auth>') \
            > ${client_output_dir}/${id}.ovpn`
        );
    }

    bindClientIp(id, ipAddress) {
        return this._runCommand(
            `sudo mkdir -p ${ccd_dir} && sudo touch ${ccd_dir}/${id} && echo "${ipAddress} ${this.nextIpAddress(ipAddress)}" | sudo tee ${ccd_dir}/${id}`
        );
    }

    nextIpAddress(ipAddress) {
        const sections = ipAddress.split('.');
        sections[3] = +(sections[3])++;
        return sections.join('.');
    }

    defaultError(e) {
        this.log(e, LOG.LEVEL.ERROR);
        return e;
    }

    defaultSuccess(response, error_on_non_zero = true) {
        if (error_on_non_zero && response.code !== 0) {
            return Promise.reject(response)
        }

        if (response.code !== 0) {
            this.log(response, LOG.LEVEL.WARNING);
        } else {
            this.log(response, LOG.LEVEL.INFO);
        }

        return response;
    }

    _runCommand(command, params = {}, error_on_non_zero = true) {
        let log_time = (t0) => {
            let time = (performance.now() - t0) / 1000;
            this.log(`${command} has finished, took: ${time} seconds`, LOG.LEVEL.INFO);
            return time;
        };

        let t0 = performance.now();

        this.log(`${command} has started`, LOG.LEVEL.INFO);
        return this._ssh.execCommand(command, params).then((response) => {
            response.command = command;
            response.command_time = log_time(t0);
            return response;
        })
            .catch((e) => this.defaultError(e))
            .then((response) => this.defaultSuccess(response, error_on_non_zero));

    }

    ls() {
        return this._runCommand(`ls -al ${cert_directory}`);
    }

    aptGetUpdate() {
        return this._runCommand('sudo apt-get update');
    }

    aptGetInstall() {
        return this._runCommand('sudo apt-get install openvpn easy-rsa -y');
    }

    makeCADir() {
        return this._runCommand(`make-cadir ${cert_directory}`, {}, false).then((response) => {
            if (response.code === 0) {
                return response;
            } else if (response.code === 1 && response.stdout.includes('openvpn-ca exists')) {
                this.log(`Directory ${cert_directory} exists, omitting`, LOG.LEVEL.INFO);
                return response;
            } else {
                return Promise.reject(response);
            }
        });
    }

    configureCAVars() {
        let command = (command) => this._runCommand(command);
        let server = this.server;

        return this._runCommand(`sed -i 's/KEY_NAME=".*"/KEY_NAME="server"/' ${vars_file}`)
            .then((r) => command(`sed -i 's/KEY_COUNTRY=".*"/KEY_COUNTRY="${server.country}"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_PROVINCE=".*"/KEY_PROVINCE="${server.province}"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_CITY=".*"/KEY_CITY="${server.city}"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_ORG=".*"/KEY_ORG="${server.org}"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_EMAIL=".*"/KEY_EMAIL="${server.email}"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_OU=".*"/KEY_OU="${server.ou}"/' ${vars_file}`));
    }

    cleanAll() {
        return this._runCommand(
            `${cert_begin} && ${clean_all}`
        );
    }

    buildCA() {
        return this._runCommand(
            `${cert_begin} && ${build_ca}`
        );
    }

    buildKeyServer() {
        return this._runCommand(
            `${build_key_server}`
        );
    }

    buildDH() {
        return this._runCommand(
            `${build_dh}`
        );
    }

    buildHMAC() {
        return this._runCommand(
            `${build_hmac}`
        );
    }

    copyKeys() {
        return this._runCommand(
            `${copy_keys}`
        );
    }

    enable_ip_forward() {
        return this._runCommand(
            `sudo sed -i -r 's/#?net\.ipv4\.ip_forward\=.*/net\.ipv4\.ip_forward=1/' /etc/sysctl.conf && sudo sysctl -p`
        );
    }

    configure_firewall() {
        let interface_name = '';
        return this._runCommand(`ip route | grep default`).then((response) => {
            interface_name = response.stdout.split(' ');
            interface_name = interface_name[4];

            if (!interface_name) {
                throw Error('Could not find interface name');
            }

            let command = `*nat\n:POSTROUTING ACCEPT [0:0]\n-A POSTROUTING -s 10.8.0.0/8 -o ${interface_name} -j MASQUERADE\nCOMMIT\n`;

            return this._runCommand(`sudo cat /etc/ufw/before.rules`).then(response => {
                let data = response.stdout;
                if (data.indexOf(command) !== -1) {
                    return;
                }
                return this._runCommand(`echo "${command}\n${data}" | sudo tee /etc/ufw/before.rules`);
            });
        })
            .then(() => this._runCommand(`sudo sed -i 's/DEFAULT_FORWARD_POLICY=".*"/DEFAULT_FORWARD_POLICY="ACCEPT"/' /etc/default/ufw`))
            .then(() => this._runCommand(`sudo ufw allow ${this.server.config.port}/udp`))
            .then(() => this._runCommand(`sudo ufw allow OpenSSH`))
            .then(() => this._runCommand(`sudo ufw disable && sudo ufw --force enable`)); // force is needed for non-interactive mode
    }

    start_openvpn() {
        return this._runCommand(`sudo systemctl start openvpn@server`)
            .then(() => this._runCommand(`sudo systemctl status openvpn@server`))
            .then(() => this._runCommand(`sudo systemctl enable openvpn@server`));
    }

    setup_client_infrastructure() {
        return this._runCommand(`mkdir -p ~/client-configs/files && chmod 700 ~/client-configs/files`)
            .then(() => this.uploadClientBaseConfig());
    }

    uploadServerConfig() {
        let config_content = this._generate_server_config();
        return this._runCommand(
            `echo "${config_content}" | sudo tee ${conf_file}`
        );
    }

    uploadClientBaseConfig() {
        let config_content = this._generate_client_base_config();
        return this._runCommand(
            `echo "${config_content}" | sudo tee ${client_conf_base_file}`
        );
    }

    _generate_server_config() {
        let disabled = (x) => !x ? ';' : '';
        let config = this.server.config;
        return `${disabled(config.local_ip_address)}local ${config.local_ip_address}
port ${config.port}
proto ${config.dev}
dev ${config.protocol}
${disabled(config.dev_node)}dev-node ${config.dev_node}
ca ca.crt
cert server.crt
key server.key
dh dh2048.pem
;topology subnet
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
;server-bridge 10.8.0.4 255.255.255.0 10.8.0.50 10.8.0.100
;server-bridge
;push "route 192.168.10.0 255.255.255.0"
;push "route 192.168.20.0 255.255.255.0"
${disabled(config.dev === 'tun')}client-config-dir ccd
;route 192.168.40.128 255.255.255.248
;learn-address ./script
;push "redirect-gateway def1 bypass-dhcp"
;push "dhcp-option DNS 208.67.222.222"
;push "dhcp-option DNS 208.67.220.220"
;client-to-client
;duplicate-cn
keepalive 10 120
${disabled(config.tls_auth)}tls-auth ta.key 0
cipher ${config.cipher_algorithm}
comp-lzo
${disabled(config.max_clients)}max-clients ${config.max_clients}
${disabled(config.user_privilege)}user ${config.user_privilege}
${disabled(config.group_privilege)}group ${config.group_privilege}
persist-key
persist-tun
status openvpn-status.log
;log         openvpn.log
;log-append  openvpn.log
verb 3
;mute 20
key-direction 0
auth ${config.auth_algorithm}`;
    }

    _generate_client_base_config() {
        let disabled = (x) => !x ? ';' : '';
        let server = this.server;
        let config = this.server.config;
        return `client
dev ${config.dev}
${disabled(config.dev_node)}dev-node ${config.dev_node}
proto ${config.protocol}
remote ${server.host} ${config.port}
;remote my-server-2 1194
;remote-random
resolv-retry infinite
nobind
${disabled(config.user_privilege)}user ${config.user_privilege}
${disabled(config.group_privilege)}group ${config.group_privilege}
persist-key
persist-tun
;http-proxy-retry
;http-proxy [proxy server] [proxy port
;mute-replay-warnings
#ca ca.crt # we place tese in ovpn file
#cert client.crt
#key client.key
remote-cert-tls server
${disabled(config.tls_auth)}tls-auth ta.key 1
cipher ${config.cipher_algorithm}
comp-lzo
verb 3
;mute 20
key-direction 1
auth ${config.auth_algorithm}

# Uncomment these lines on linux machine
# script-security 2
# up /etc/openvpn/update-resolv-conf
# down /etc/openvpn/update-resolv-conf`;
    }

    download_ovpn_file({id}) {
        return new Promise((resolve, reject) => {
            this.connection
                .then(() => {
                    let file_path = `${client_output_dir}/${id}.ovpn`;
                    return this._runCommand(`ls ${file_path}`)
                        .then((response) => {
                            let filename = remote.dialog.showSaveDialog(
                                remote.getCurrentWindow(),
                                {
                                    defaultPath: `${id}.ovpn`
                                }
                            );
                            return this._ssh.getFile(filename, `/home/${this.config.username}/client-configs/files/${id}.ovpn`);
                        }).catch(e => reject(e));
                })
                .then(resolve)
                .catch((e) => {
                    this.log('Something failed...', LOG.LEVEL.ERROR);
                    this.log(e, LOG.LEVEL.ERROR);
                    reject(e);
                });
        });
    }
}

