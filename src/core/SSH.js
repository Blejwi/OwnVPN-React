import NodeSSH from 'node-ssh';
import fs from 'fs';
import { remote } from 'electron';
import { swal } from 'react-redux-sweetalert';
import { map } from 'lodash';
import { add as addLog } from '../actions/logs';
import * as LOG from '../constants/logs';
import SSHStats from './SSHStats';

const certDirectory = '~/openvpn-ca';
const varsFile = `${certDirectory}/vars`;
const certBegin = `cd ${certDirectory} && source ${varsFile}`;

const cleanAll = `${certDirectory}/clean-all`;
const buildCa = `${certDirectory}/pkitool --initca`;
const buildKeyServer = `${certBegin} && ${certDirectory}/pkitool --batch --server server`;

const buildDh = `${certBegin} && ${certDirectory}/build-dh`;
const buildHmac = `openvpn --genkey --secret ${certDirectory}/keys/ta.key`;
const allKeys = 'ca.crt ca.key server.crt server.key ta.key dh2048.pem';
const copyKeys = `cd ${certDirectory}/keys && sudo cp ${allKeys} /etc/openvpn`;
const checkKeys = `cd ${certDirectory}/keys && ls ${allKeys}`;


const generateClientKey = `${certDirectory}/pkitool --batch`;
const confFile = '/etc/openvpn/server.conf';
const clientConfBaseFile = '~/client-configs/base.conf';
const clientKeysDir = '~/openvpn-ca/keys';
const clientOutputDir = '~/client-configs/files';
const ccdDir = '/etc/openvpn/ccd'; // it should be able to reassigned by server configuration

export default class SSH {
    constructor(dispatch, server) {
        this.dispatch = dispatch;
        this.server = server;
        this.ssh = new NodeSSH();

        this.config = {
            host: server.host,
            port: server.port,
            username: server.username,
        };

        if (server.key) {
            this.config.privateKey = fs.readFileSync(server.key, 'utf-8', 'r');
        }

        if (server.password) {
            this.config.password = server.password;
        }

        this.connection = this.ssh.connect(this.config)
            .catch(e => Promise.reject(this.defaultError(e)));

        this.statistics = new SSHStats(this, dispatch);
    }

    log(msg, level) {
        this.dispatch(addLog(msg, level, 'SSH'));
    }

    setupServer() {
        this.log('Starting setup_server', LOG.LEVEL.INFO);

        return new Promise((resolve, reject) => {
            this.connection
                .then(() => this.aptGetUpdate()
                    .then(() => this.aptGetInstall())
                    .then(() => this.makeCADir())
                    .then(() => this.configureCAVars())
                    .then(() => this.generateServerKeys())
                    .then(() => this.copyKeys())
                    .then(() => this.uploadServerConfig())
                    .then(() => this.enableIpForward())
                    .then(() => this.configureFirewall())
                    .then(() => this.startVpn())
                    .then(() => this.setupClientInfrastructure())
                    .then(resolve)
                    .catch((e) => {
                        this.log('Something failed...', LOG.LEVEL.ERROR);
                        this.log(e, LOG.LEVEL.ERROR);
                        reject(e);
                    }))
                .catch(e => reject(e));
        });
    }

    setupClient({ id, ipAddress }) {
        this.log('Starting setup_client', LOG.LEVEL.INFO);

        return new Promise((resolve, reject) => {
            this.connection
                .then(() => this.runCommand(`ls ${clientKeysDir}/${id}.key`, {}, false)
                    .then((response) => {
                        if (response.code === 0) {
                            // Cert with given name exists
                            this.log(`Key with name ${id} already exists`, LOG.LEVEL.WARNING);
                            return new Promise((responseResolve, responseReject) => {
                                this.dispatch(swal({
                                    title: 'Key exists',
                                    type: 'warning',
                                    confirmButtonText: 'Yes',
                                    cancelButtonText: 'No',
                                    text: `Key with name ${id} already exists. Do you want to regenerate it?`,
                                    showCancelButton: true,
                                    closeOnConfirm: true,
                                    onConfirm: () => responseResolve(response),
                                    onCancel: () => responseReject(response),
                                    allowOutsideClick: true,
                                    onOutsideClick: () => responseReject(response),
                                    onEscapeKey: () => responseReject(response),
                                }));
                            }).then(() => this.runCommand(`rm ${clientKeysDir}/${id}.key`)
                                .then(() => this.removeCrtFromDB(id))
                                .then(() => this.generateClientKey(id))
                                .then(() => this.generateClientConfigFiles(id)
                                    .then(() => this.bindClientIp(id, ipAddress)))).catch(e => e);
                        } else if (response.code === 2) {
                            // Cert not exist
                            return this.generateClientKey(id)
                                .then(() => this.generateClientConfigFiles(id)
                                    .then(() => this.bindClientIp(id, ipAddress)));
                        }
                        throw response;
                    }))
                .then(() => this.restartVpn())
                .then(resolve)
                .catch((e) => {
                    this.log('Something failed...', LOG.LEVEL.ERROR);
                    this.log(e, LOG.LEVEL.ERROR);
                    reject(e);
                });
        });
    }

    deleteClientFiles({ id }) {
        return new Promise((resolve, reject) => {
            this.connection
                .then(() => this.runCommand(
                    `rm -rf ${clientKeysDir}/${id}.key ${clientOutputDir}/${id}.ovpn ${clientKeysDir}/${id}.crt`,
                ))
                .then(() => this.removeCrtFromDB(id))
                .then(() => this.restartVpn())
                .then(resolve)
                .catch((e) => {
                    this.log('Something failed...', LOG.LEVEL.ERROR);
                    this.log(e, LOG.LEVEL.ERROR);
                    reject(e);
                });
        });
    }

    generateServerKeys() {
        return this.runCommand(`${checkKeys}`, {}, false).then((response) => {
            if (response.code === 0) {
                return new Promise((resolve, reject) => {
                    this.dispatch(swal({
                        title: 'Key exists',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        type: 'warning',
                        text: 'Server keys already exists. Do you want to regenerate them?',
                        showCancelButton: true,
                        closeOnConfirm: true,
                        onConfirm: () => resolve(response),
                        onCancel: () => reject(response),
                        allowOutsideClick: true,
                        onOutsideClick: () => reject(response),
                        onEscapeKey: () => reject(response),
                    }));
                }).then(() => this.generateAllServerKeys()).catch(keysResponse => keysResponse);
            }
            return this.generateAllServerKeys();
        });
    }

    generateAllServerKeys() {
        return this.cleanAll()
            .then(() => this.buildCA())
            .then(() => this.buildKeyServer())
            .then(() => this.buildDH())
            .then(() => this.buildHMAC());
    }

    generateClientKey(id) {
        return this.runCommand(
            `${certBegin} && ${generateClientKey} ${id}`,
        );
    }

    removeCrtFromDB(id) {
        return this.runCommand(
            `sed -i '/CN=${id}/d' ${clientKeysDir}/index.txt`,
        );
    }

    generateClientConfigFiles(id) {
        return this.runCommand(
            `cat ${clientConfBaseFile} \
            <(echo -e '<ca>') \
            ${clientKeysDir}/ca.crt \
            <(echo -e '</ca>\n<cert>') \
            ${clientKeysDir}/${id}.crt \
            <(echo -e '</cert>\n<key>') \
            ${clientKeysDir}/${id}.key \
            <(echo -e '</key>\n<tls-auth>') \
            ${clientKeysDir}/ta.key \
            <(echo -e '</tls-auth>') \
            > ${clientOutputDir}/${id}.ovpn`,
        );
    }

    bindClientIp(id, ipAddress) {
        return this.runCommand(
            `sudo mkdir -p ${ccdDir} && sudo touch ${ccdDir}/${id} && echo "${ipAddress} ${SSH.nextIpAddress(ipAddress)}" | sudo tee ${ccdDir}/${id}`,
        );
    }

    static nextIpAddress(ipAddress) {
        const sections = ipAddress.split('.');
        sections[3] = +(sections[3]) + 1;
        return sections.join('.');
    }

    defaultError(e) {
        this.log(e, LOG.LEVEL.ERROR);
        return e;
    }

    defaultSuccess(response, errorOnNonZero = true) {
        if (errorOnNonZero && response.code !== 0) {
            return Promise.reject(response);
        }

        if (response.code !== 0) {
            this.log(response, LOG.LEVEL.WARNING);
        } else {
            this.log(response, LOG.LEVEL.INFO);
        }

        return response;
    }

    runCommand(command, params = {}, errorOnNonZero = true) {
        const logTime = (t0) => {
            const time = (performance.now() - t0) / 1000;
            this.log(`${command} has finished, took: ${time} seconds`, LOG.LEVEL.INFO);
            return time;
        };

        const t0 = performance.now();

        this.log(`${command} has started`, LOG.LEVEL.INFO);
        return this.ssh.execCommand(command, params)
            .then(response => ({ ...response, command, command_time: logTime(t0) }))
            .catch(e => this.defaultError(e))
            .then(response => this.defaultSuccess(response, errorOnNonZero));
    }

    ls() {
        return this.runCommand(`ls -al ${certDirectory}`);
    }

    aptGetUpdate() {
        return this.runCommand('sudo apt-get update');
    }

    aptGetInstall() {
        return this.runCommand('sudo apt-get install openvpn easy-rsa -y');
    }

    makeCADir() {
        return this.runCommand(`make-cadir ${certDirectory}`, {}, false).then((response) => {
            if (response.code === 0) {
                return response;
            } else if (response.code === 1 && response.stdout.includes('openvpn-ca exists')) {
                this.log(`Directory ${certDirectory} exists, omitting`, LOG.LEVEL.INFO);
                return response;
            }
            return Promise.reject(response);
        });
    }

    configureCAVars() {
        const run = command => this.runCommand(command);
        const server = this.server;

        return this.runCommand(`sed -i 's/KEY_NAME=".*"/KEY_NAME="server"/' ${varsFile}`)
            .then(() => run(`sed -i 's/KEY_COUNTRY=".*"/KEY_COUNTRY="${server.country}"/' ${varsFile}`))
            .then(() => run(`sed -i 's/KEY_PROVINCE=".*"/KEY_PROVINCE="${server.province}"/' ${varsFile}`))
            .then(() => run(`sed -i 's/KEY_CITY=".*"/KEY_CITY="${server.city}"/' ${varsFile}`))
            .then(() => run(`sed -i 's/KEY_ORG=".*"/KEY_ORG="${server.org}"/' ${varsFile}`))
            .then(() => run(`sed -i 's/KEY_EMAIL=".*"/KEY_EMAIL="${server.email}"/' ${varsFile}`))
            .then(() => run(`sed -i 's/KEY_OU=".*"/KEY_OU="${server.ou}"/' ${varsFile}`));
    }

    cleanAll() {
        return this.runCommand(
            `${certBegin} && ${cleanAll}`,
        );
    }

    buildCA() {
        return this.runCommand(
            `${certBegin} && ${buildCa}`,
        );
    }

    buildKeyServer() {
        return this.runCommand(
            `${buildKeyServer}`,
        );
    }

    buildDH() {
        return this.runCommand(
            `${buildDh}`,
        );
    }

    buildHMAC() {
        return this.runCommand(
            `${buildHmac}`,
        );
    }

    copyKeys() {
        return this.runCommand(
            `${copyKeys}`,
        );
    }

    enableIpForward() {
        return this.runCommand(
// eslint-disable-next-line no-useless-escape
            'sudo sed -i -r \'s/#?net\.ipv4\.ip_forward\=.*/net\.ipv4\.ip_forward=1/\' /etc/sysctl.conf && sudo sysctl -p',
        );
    }

    configureFirewall() {
        let interfaceName = '';
        return this.runCommand('ip route | grep default').then((response) => {
            interfaceName = response.stdout.split(' ');
            interfaceName = interfaceName[4];

            if (!interfaceName) {
                throw Error('Could not find interface name');
            }

            const command = `*nat\n:POSTROUTING ACCEPT [0:0]\n-A POSTROUTING -s 10.8.0.0/8 -o ${interfaceName} -j MASQUERADE\nCOMMIT\n`;

            return this.runCommand('sudo cat /etc/ufw/before.rules').then((catResponse) => {
                const data = catResponse.stdout;
                if (data.indexOf(command) !== -1) {
                    return;
                }
                return this.runCommand(`echo "${command}\n${data}" | sudo tee /etc/ufw/before.rules`);
            });
        })
            .then(() => this.runCommand('sudo sed -i \'s/DEFAULT_FORWARD_POLICY=".*"/DEFAULT_FORWARD_POLICY="ACCEPT"/\' /etc/default/ufw'))
            .then(() => this.runCommand(`sudo ufw allow ${this.server.config.port}/udp`))
            .then(() => this.runCommand('sudo ufw allow OpenSSH'))
            .then(() => this.runCommand('sudo ufw disable && sudo ufw --force enable')); // force is needed for non-interactive mode
    }

    startVpn() {
        return this.runCommand('sudo systemctl start openvpn@server')
            .then(() => this.runCommand('sudo systemctl status openvpn@server'))
            .then(() => this.runCommand('sudo systemctl enable openvpn@server'));
    }

    restartVpn() {
        return this.runCommand('sudo systemctl restart openvpn@server')
            .then(() => this.runCommand('sudo systemctl status openvpn@server'));
    }

    setupClientInfrastructure() {
        return this.runCommand('mkdir -p ~/client-configs/files && chmod 700 ~/client-configs/files')
            .then(() => this.uploadClientBaseConfig());
    }

    uploadServerConfig() {
        const configContent = this.generateServerConfig();
        return this.runCommand(
            `echo "${configContent}" | sudo tee ${confFile}`,
        );
    }

    uploadClientBaseConfig() {
        const configContent = this.generateClientBaseConfig();
        return this.runCommand(
            `echo "${configContent}" | sudo tee ${clientConfBaseFile}`,
        );
    }

    generateServerConfig() {
        const disabled = (prop) => {
            if (prop) {
                return '';
            }
            return ';';
        };
        const config = this.server.config;
        return `${disabled(config.local_ip_address)}local ${config.local_ip_address}
port ${config.port}
proto ${config.protocol}
dev ${config.dev}
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
${map(config.routes, route => `push "route ${route.network} ${route.mask}"\n`)}
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

    generateClientBaseConfig() {
        const disabled = (prop) => {
            if (prop) {
                return '';
            }
            return ';';
        };
        const server = this.server;
        const config = this.server.config;
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

    downloadConfiguration({ id }) {
        return new Promise((resolve, reject) => {
            this.connection
                .then(() => {
                    const filePath = `${clientOutputDir}/${id}.ovpn`;
                    return this.runCommand(`ls ${filePath}`)
                        .then(() => this.runCommand(`readlink -f ${filePath}`))
                        .then((response) => {
                            const absoluteFilePath = response.stdout;
                            const filename = remote.dialog.showSaveDialog(
                                remote.getCurrentWindow(),
                                {
                                    defaultPath: `${id}.ovpn`,
                                },
                            );

                            return this.ssh.getFile(filename, absoluteFilePath);
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

