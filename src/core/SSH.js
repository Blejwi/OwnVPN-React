import NodeSSH from 'node-ssh';
import {map} from 'lodash';
import {add as addLog} from '../actions/logs';
import * as LOG from "../constants/logs";

const cert_directory = '~/openvpn-ca';
const vars_file = `${cert_directory}/vars`;
const cert_begin = `cd ${cert_directory} && source ${vars_file}`;

const clean_all = `${cert_directory}/clean-all`;
const build_ca = `${cert_directory}/pkitool --initca`;
const build_key_server = `${cert_begin} && ${cert_directory}/pkitool --batch --server server`;

const build_dh = `${cert_begin} && ${cert_directory}/build-dh`;
const build_hmac = `openvpn --genkey --secret ${cert_directory}/keys/ta.key`;
const copy_keys = `cd ${cert_directory}/keys && sudo cp ca.crt ca.key server.crt server.key ta.key dh2048.pem /etc/openvpn`;

const conf_file = `/etc/openvpn/server.conf`;

export default class SSH {
    constructor(dispatch, server) {
        this.dispatch = dispatch;
        this.server = server;
        this._ssh = new NodeSSH();

        this.connection = this._ssh.connect({
            host: server.ipAddress,
            username: server.username,
            privateKey: server.privateKey
        }).catch((e) => this.defaultError(e));
    }

    log(msg, level) {
        this.dispatch(addLog(msg, level, 'SSH'));
    }

    setup() {
        this.log('Starting setup', LOG.LEVEL.INFO);

        return new Promise((resolve, reject) => {
            this.connection
                // .then(() => this.aptGetUpdate())
                // .then(() => this.aptGetInstall())
                // .then(() => this.makeCADir())
                // .then(() => this.configureCAVars())
                // .then(() => this.cleanAll())
                // .then(() => this.buildCA())
                // .then(() => this.buildKeyServer())
                // .then(() => this.buildDH())
                // .then(() => this.buildHMAC())
                .then(() => this.copyKeys())
                .then(() => this.prepareConfig())
                .then(() => this.ls())
                .then(resolve)
                .catch((e) => {
                    this.log('Something failed...', LOG.LEVEL.ERROR);
                    this.log(e, LOG.LEVEL.ERROR);
                    reject(e);
                });
        });
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
            this.log(e, LOG.LEVEL.WARNING);
        } else {
            this.log(e, LOG.LEVEL.INFO);
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

        return this._runCommand(`ls`) // placeholder TODO remove
            .then((r) => command(`sed -i 's/KEY_NAME=".*"/KEY_NAME="server"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_COUNTRY=".*"/KEY_COUNTRY="PL"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_PROVINCE=".*"/KEY_PROVINCE="CA"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_CITY=".*"/KEY_CITY="POZNAN"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_ORG=".*"/KEY_ORG="PUT"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_EMAIL=".*"/KEY_EMAIL="example@example.com"/' ${vars_file}`))
            .then((r) => command(`sed -i 's/KEY_OU=".*"/KEY_OU="MyOrganizationalUnit"/' ${vars_file}`));
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

    prepareConfig() {
        return this._runCommand(
            `gunzip -c /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz | sudo tee ${conf_file}`
        ).then((r) => this._runCommand(`sudo sed -i 's/;tls-auth ta\.key 0/tls-auth ta\.key 0/' ${conf_file}`))
            .then((r) => this._runCommand(`echo 'key-direction 0' | sudo tee -a ${conf_file}`))
            .then((r) => this._runCommand(`sudo sed -i 's/;cipher AES-128-CBC/cipher AES-128-CBC/' ${conf_file}`))
            .then((r) => this._runCommand(`echo 'auth SHA256' | sudo tee -a ${conf_file}`))
            .then((r) => this._runCommand(`sudo sed -i 's/;user nobody/user nobody/' ${conf_file}`))
            .then((r) => this._runCommand(`sudo sed -i 's/;group nogroup/group nogroup/' ${conf_file}`));
    }

}