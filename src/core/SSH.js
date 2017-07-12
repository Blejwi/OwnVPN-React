import NodeSSH from 'node-ssh';
import fs from 'fs';
import { remote } from 'electron';
import { swal } from 'react-redux-sweetalert';
import { add as addLog } from '../actions/logs';
import * as LOG from '../constants/logs';
import SSHStats from './SSHStats';
import ConfigurationGenerator from './ConfigurationGenerator';

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
const clientKeysDir = '~/openvpn-ca/keys';
const clientOutputDir = '~/client-configs/files';
const ccdDir = '/etc/openvpn/ccd'; // it should be able to reassigned by server configuration

/**
 * Default SSH connection class
 */
export default class SSH {
    /**
     * Constructor function.
     * Checks connection, creates SSH connection to server,
     * check if sudo password is required to run commands
     * @param {function} dispatch Redux dispatch function
     * @param {object} server Server config object
     */
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

        this.sudoPasswordRequired = false;

        this.connection = this.ssh.connect(this.config)
            .catch(e => Promise.reject(this.defaultError(e)))
            .then(() => this.determineSudoPasswordNeeded());

        this.statistics = new SSHStats(this, dispatch);
    }

    /**
     * Check if commands ran on server needs sudo password
     * @return {Promise}
     */
    determineSudoPasswordNeeded() {
        return this.runCommand('sudo -n true').then(() => null).catch((e) => {
            if (e.stderr.indexOf('password is required') !== -1) {
                // Got sudo access but password is required
                this.sudoPasswordRequired = true;
                return this.runCommand(`echo "${this.config.password}" | sudo -S -v`)
                    .then(() => null)
                    .catch(error => Promise.reject(this.defaultError(error)));
            }
            return Promise.reject(this.defaultError(e));
        });
    }

    /**
     * Log function wrapper for logging module
     * @param msg
     * @param level
     */
    log(msg, level) {
        this.dispatch(addLog(msg, level, 'SSH'));
    }

    /**
     * Function for setup of OpenVPN server
     * @return {Promise}
     */
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
                    .then(() => this.restartVpn())
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

    /**
     * Function for uploading config file on server and restarting OpenVPN to apply new config file
     * @return {Promise}
     */
    uploadConfig() {
        return new Promise((resolve, reject) => {
            this.connection
                .then(() => this.uploadServerConfig()
                    .then(() => this.restartVpn())
                    .then(resolve)
                    .catch((e) => {
                        this.log('Something failed...', LOG.LEVEL.ERROR);
                        this.log(e, LOG.LEVEL.ERROR);
                        reject(e);
                    }))
                .catch(e => reject(e));
        });
    }

    /**
     * Function used for OpenVPN user setup
     * @param {string} id User id
     * @param {string} ipAddress User ip address
     * @param {object} config User config
     * @return {Promise}
     */
    setupClient({ id, ipAddress, config }) {
        this.log('Starting setup_client', LOG.LEVEL.INFO);

        return new Promise((resolve, reject) => {
            const checkUserFilesCommand = `ls ${clientKeysDir}/${id}.key && ls ${clientKeysDir}/${id}.crt && ls ${clientKeysDir}/${id}.csr`;
            this.connection
                .then(() => this.runCommand(checkUserFilesCommand, {}, false)
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
                                .then(() => this.generateClientConfigFiles(id, config))
                                .then(() => this.bindClientIp(id, ipAddress)))
                            // eslint-disable-next-line arrow-body-style
                            .catch(() => {
                                // eslint-disable-next-line arrow-body-style
                                return this.runCommand(`ls ${clientOutputDir}/${id}.ovpn`).then(() => {
                                    return this.shouldRegenerateOvpn(response)
                                        .then(() => this.generateClientConfigFiles(id, config))
                                        .catch(() => {});
                                }).catch(() => {});
                            });
                        } else if (response.code === 2) {
                            // Cert not exist
                            return this.generateClientKey(id)
                                .then(() => this.generateClientConfigFiles(id, config)
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

    /**
     * Function checks if ovpn user file should be generated
     * @param {object} response SSH command response
     * @return {Promise}
     */
    shouldRegenerateOvpn(response) {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.dispatch(swal({
                title: 'Key exists',
                type: 'warning',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                text: 'Do you want to regenerate ovpn file??',
                showCancelButton: true,
                closeOnConfirm: true,
                onConfirm: () => resolve(response),
                onCancel: () => reject(response),
                allowOutsideClick: true,
                onOutsideClick: () => reject(response),
                onEscapeKey: () => reject(response),
            })), 200);
        });
    }

    /**
     * Function for deleting client files from server
     * @param {string} id Id of client
     * @return {Promise}
     */
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

    /**
     * Function showing confirm popup if user wants to regenerate server keys
     * @return {Promise}
     */
    generateServerKeys() {
        return this.runCommand(`${checkKeys}`, {}, false).then((response) => {
            if (response.code === 0) {
                return new Promise((resolve, reject) => {
                    this.dispatch(swal({
                        title: 'Key exists',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        type: 'warning',
                        text: 'Server keys already exists. ' +
                        'Do you want to regenerate them? ' +
                        'Please note that this action will erase all server and client keys from the server and ' +
                        'this action cannot be undone',
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

    /**
     * Function used for generating server keys
     * @return {Promise}
     */
    generateAllServerKeys() {
        return this.cleanAll()
            .then(() => this.buildCA())
            .then(() => this.buildKeyServer())
            .then(() => this.buildDH())
            .then(() => this.buildHMAC());
    }

    /**
     * Function used for generating user keys
     * @param {string} id Id of user
     * @return {Promise}
     */
    generateClientKey(id) {
        return this.runCommand(
            `${certBegin} && ${generateClientKey} ${id}`,
        );
    }

    /**
     * Function used to remove user from index file
     * @param {string} id Id of user
     * @return {Promise}
     */
    removeCrtFromDB(id) {
        return this.runCommand(
            `sed -i '/CN=${id}/d' ${clientKeysDir}/index.txt`,
        );
    }

    /**
     * Generate OVPN user file
     * @param {string} id Id of client
     * @param {object} userConfig User config
     * @return {Promise}
     */
    generateClientConfigFiles(id, userConfig) {
        return this.runCommand(
            `cat /dev/null \
            <(echo -e '${this.generateClientConfig(userConfig)}') \
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

    /**
     * Function used to bind client IP
     * @param {string} id Id of user
     * @param {string} ipAddress IP address of user
     * @return {Promise}
     */
    bindClientIp(id, ipAddress) {
        return this.runCommand(
            `sudo mkdir -p ${ccdDir} && sudo touch ${ccdDir}/${id} && echo "${ipAddress} ${SSH.nextIpAddress(ipAddress)}" | sudo tee ${ccdDir}/${id}`,
        );
    }

    /**
     * Function for incrementing IP address
     * @param {string} ipAddress IP address
     * @return {string} IP address incremented by 1
     */
    static nextIpAddress(ipAddress) {
        const sections = ipAddress.split('.');
        sections[3] = +(sections[3]) + 1;
        return sections.join('.');
    }

    /**
     * Default error handler
     * @param {Error} e Error object
     * @return {Error} Error object
     */
    defaultError(e) {
        this.log(e, LOG.LEVEL.ERROR);
        return e;
    }

    /**
     * Default success function
     * @param {object} response SSH command response
     * @param {bool} errorOnNonZero Indicates if erro should be raised on non-zero bash response
     * @return {object} Response object
     */
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

    /**
     * Run command wrapper function. Adds sudo if required
     * @param {string} command Command to be run
     * @param {object} [params={}] Params for SSH command
     * @param {bool} errorOnNonZero Indicates if erro should be raised on non-zero bash response
     * @return {Promise}
     */
    runCommand(command, params = {}, errorOnNonZero = true) {
        const logTime = (t0) => {
            const time = (performance.now() - t0) / 1000;
            this.log(`${command} has finished, took: ${time} seconds`, LOG.LEVEL.INFO);
            return time;
        };

        const t0 = performance.now();

        this.log(`${command} has started`, LOG.LEVEL.INFO);

        let finalCommand = command;
        if (this.sudoPasswordRequired && command.indexOf('sudo') !== -1) {
            finalCommand = `echo "${this.config.password}" | sudo -S -v && ${command}`
        }

        return this.ssh.execCommand(finalCommand, params)
            .then(response => ({ ...response, command, command_time: logTime(t0) }))
            .catch(e => this.defaultError(e))
            .then(response => this.defaultSuccess(response, errorOnNonZero));
    }

    /**
     * Command used to list files in certificates directory
     * @return {Promise}
     */
    ls() {
        return this.runCommand(`ls -al ${certDirectory}`);
    }

    /**
     * Command used to run apt-get update command
     * @return {Promise}
     */
    aptGetUpdate() {
        return this.runCommand('sudo apt-get update');
    }

    /**
     * Command used to install openvpn and easy-rsa packages
     * @return {Promise}
     */
    aptGetInstall() {
        return this.runCommand('sudo apt-get install openvpn easy-rsa -y');
    }

    /**
     * Command used to created certificates directory
     * @return {Promise}
     */
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

    /**
     * Helper function for generate sed command to replace certificate variables in vars file
     * @param {string} key Key of option
     * @param {string} value Value to be set
     * @return {string} SED command
     */
    setCAVar(key, value) {
        return `sed -i 's/${key}=".*"/${key}="${value || ''}"/' ${varsFile}`;
    }

    /**
     * Function for setting certificate vars
     * @return {Promise}
     */
    configureCAVars() {
        const run = command => this.runCommand(command);
        const server = this.server;

        return this.runCommand(this.setCAVar('KEY_NAME', 'server'))
            .then(() => run(this.setCAVar('KEY_COUNTRY', server.country)))
            .then(() => run(this.setCAVar('KEY_PROVINCE', server.province)))
            .then(() => run(this.setCAVar('KEY_CITY', server.city)))
            .then(() => run(this.setCAVar('KEY_ORG', server.org)))
            .then(() => run(this.setCAVar('KEY_EMAIL', server.email)))
            .then(() => run(this.setCAVar('KEY_OU', server.ou)));
    }

    /**
     * @ignore
     */
    setCaCommonNameVar() {
        return this.runCommand(`cat ${varsFile}`).then((response) => {
            if (response.stdout.match(/^export KEY_CN=".*"/gm)) {
                return this.runCommand(this.setCAVar('KEY_CN', 'server'));
            } else {
                return this.runCommand(`echo 'export KEY_CN="server"' >> ${varsFile}`);
            }
        });
    }

    /**
     * Function used for cleaning all certificates
     * @return {Promise}
     */
    cleanAll() {
        return this.runCommand(
            `${certBegin} && ${cleanAll}`,
        );
    }

    /**
     * Function used for creating CA directory
     * @return {Promise}
     */
    buildCA() {
        return this.runCommand(
            `${certBegin} && ${buildCa}`,
        );
    }

    /**
     * Function used for creating server key
     * @return {Promise}
     */
    buildKeyServer() {
        return this.runCommand(
            `${buildKeyServer}`,
        );
    }

    /**
     * Function used for generating Diffie-Hellman key-exchange parameters
     * @return {Promise}
     */
    buildDH() {
        return this.runCommand(
            `${buildDh}`,
        );
    }

    /**
     * Function used for generating HMAC key
     * @return {Promise}
     */
    buildHMAC() {
        return this.runCommand(
            `${buildHmac}`,
        );
    }

    /**
     * Function used for copying key files to /etc/openvpn directory
     * @return {Promise}
     */
    copyKeys() {
        return this.runCommand(
            `${copyKeys}`,
        );
    }

    /**
     * Enables IP forwarding in server OS
     * @return {Promise}
     */
    enableIpForward() {
        return this.runCommand(
            // eslint-disable-next-line no-useless-escape
            'sudo sed -i -r \'s/#?net\.ipv4\.ip_forward\=.*/net\.ipv4\.ip_forward=1/\' /etc/sysctl.conf && sudo sysctl -p',
        );
    }

    /**
     * Add NAT rule to UFW before.rules
     * @return {Promise}
     */
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
            .then(() => this.runCommand(`sudo ufw allow ${this.server.config.port}/${this.server.config.protocol}`))
            .then(() => this.runCommand('sudo ufw allow OpenSSH'))
            .then(() => this.runCommand('sudo ufw disable && sudo ufw --force enable')); // force is needed for non-interactive mode
    }

    /**
     * Creates client directories infrastrucutre
     * @return {Promise}
     */
    setupClientInfrastructure() {
        return this.runCommand(
            'mkdir -p ~/client-configs/files && chmod 700 ~/client-configs/files');
    }

    /**
     * Uploads server config
     * @return {Promise}
     */
    uploadServerConfig() {
        const configContent = this.generateServerConfig();
        return this.runCommand(
            `echo "${configContent}" | sudo tee ${confFile}`,
        );
    }

    /**
     * Generates server config
     * @return {string}
     */
    generateServerConfig() {
        return ConfigurationGenerator.generate(this.server.config);
    }

    /**
     * Generates client config
     * @param {object} userConfig Client config
     * @return {string} Generated OpenVPN client config
     */
    generateClientConfig(userConfig) {
        const server = this.server;
        const config = this.server.config;
        return ConfigurationGenerator.generateUser(config, server, userConfig);
    }

    /**
     * Function used for downloading user ovpn file
     * @param {string} id User id
     * @return {Promise}
     */
    downloadConfiguration({ id }) {
        return new Promise((resolve, reject) => {
            this.connection
                .then(() => {
                    const filePath = `${clientOutputDir}/${id}.ovpn`;
                    return this.runCommand(`ls ${filePath}`, {}, false)
                        .then((response) => {
                            if (response.code === 0) {
                                return this.downloadConfigFile(filePath, id, reject);
                            } else if (response.code === 2) {
                                return reject('File does not exists');
                            }
                            return reject(response);
                        });
                })
                .then(resolve)
                .catch((e) => {
                    this.log('Something failed...', LOG.LEVEL.ERROR);
                    this.log(e, LOG.LEVEL.ERROR);
                    reject(e);
                });
        });
    }

    /**
     * Function used for choosing file where to save ovpn file
     * @param {string} filePath Path to ovpn on server
     * @param {string} id User id
     * @param {function} reject Reject function
     * @return {Promise}
     */
    downloadConfigFile(filePath, id, reject) {
        return this.runCommand(`readlink -f ${filePath}`).then((response) => {
            const absoluteFilePath = response.stdout;
            const filename = remote.dialog.showSaveDialog(
                remote.getCurrentWindow(),
                {
                    defaultPath: `${id}.ovpn`,
                },
            );

            return this.ssh.getFile(filename, absoluteFilePath);
        }).catch(e => reject(e));
    }

    /**
     * Read config file from server
     * @return {Promise}
     */
    getConfigFromServer() {
        return this.catFile(confFile);
    }

    /**
     * Read content of file from server
     * @param {string} path Path to file on server
     * @return {Promise}
     */
    catFile(path) {
        return this.connection.then(() => this.runCommand(`cat ${path}`));
    }

    /**
     * Function for rebootion destination server
     * @return {Promise}
     */
    reboot() {
        return this.runCommand('sudo reboot');
    }

    /**
     * Function used to start OpenVPN via systemctl
     * @return {Promise}
     */
    startVpn() {
        return this.runCommand('sudo systemctl start openvpn@server')
            .then(() => this.runCommand('sudo systemctl status openvpn@server'))
            .then(() => this.runCommand('sudo systemctl enable openvpn@server'));
    }

    /**
     * Function used to stop OpenVPN via systemctl
     * @return {Promise}
     */
    stopVpn() {
        return this.runCommand('sudo systemctl stop openvpn@server');
    }

    /**
     * Function used to restart OpenVPN via systemctl
     * @return {Promise}
     */
    restartVpn() {
        return this.runCommand('sudo systemctl restart openvpn@server')
            .then(() => this.runCommand('sudo systemctl status openvpn@server'));
    }

    /**
     * Function wrapper for running server actions
     * @param {string} action Name of action, function of exact same name must exist in this class
     * @return {Promise>}
     */
    runAction(action) {
        return this.connection.then(() => this[action]());
    }
}

