import { MODE } from '../constants/servers';

/**
 * Class used to parse OpenVPN configuration file to state object
 */
export default class ConfigurationReader {
    /**
     * Config content class field.
     */
    content = null;

    /**
     * Function used to read value of field from config
     * @param {string} key Configuration option name
     * @return {string} Value of config option
     */
    readProperty(key) {
        const regex = new RegExp(`^${key} (.*)$`, 'm');
        const matches = regex.exec(this.content);

        if (matches !== null) {
            return matches[1];
        }

        return '';
    }

    /**
     * Checks if given config option was set in config file
     * @param {string} key Configuration option name
     * @return {boolean} True if option exists, False otherwise
     */
    isPropertySet(key) {
        const regex = new RegExp(`^${key}$`, 'm');
        return regex.test(this.content);
    }

    /**
     * Function used to read boolean config options from config
     * @param {string} key Configuration option name
     * @return {string} '1' if option is set, '0' otherwise
     */
    readBoolProperty(key) {
        if (this.readProperty(key).length > 0 || this.isPropertySet(key)) {
            return '1';
        }
        return '0';
    }

    /**
     * Function used to read ip/mask from config
     * @param {string} key Configuration option name
     * @return {{network: string, mask: string}}
     */
    readIpAndMask(key) {
        const server = this.readProperty(key).split(' ');

        return {
            network: server[0],
            mask: server[1],
        };
    }

    /**
     * Function used to read routes config option from config file
     * @return {object[]} List of Route config objects
     */
    readRoutes() {
        const regex = /^push "route (.*) (.*)"$/mg;
        const routes = [];
        let matches;

        // eslint-disable-next-line no-cond-assign
        while ((matches = regex.exec(this.content) !== null)) {
            if (matches.index === regex.lastIndex) {
                regex.lastIndex += 1;
            }

            if (matches.length > 0) {
                routes.push({
                    network: matches[1],
                    mask: matches[2],
                });
            }
        }

        return matches;
    }

    /**
     * Main function used to parse config file
     * @param {string} content Config file content to be parsed
     * @return {object} Parse config object
     */
    read(content) {
        this.content = content;
        const config = {};

        config.local_ip_address = this.readProperty('local');
        config.port = this.readProperty('port');
        config.protocol = this.readProperty('proto');
        config.dev = this.readProperty('dev');
        config.topology = this.readProperty('topology');

        if (this.readBoolProperty('server')) {
            config.server_mode = MODE.SERVER;
            config.server = this.readIpAndMask('server');
        } else if (this.readBoolProperty('server-bridge')) {
            config.server_mode = MODE.BRIDGE;
            config.server_bridge = this.readIpAndMask('server-bridge');
        }

        config.ifconfig_pool_persist = this.readBoolProperty('ifconfig-pool-persist');
        config.learn_address = this.readProperty('learn-address');
        config.routes = this.readRoutes();

        if (this.readBoolProperty('client-config-dir')) {
            if (config.server_mode === MODE.SERVER && config.dev === 'tun') {
                config.allow_subnet_route = this.readProperty('route');
                config.allow_subnet = '1';
                config.assign_ip = '0';
            } else {
                config.assign_ip_route = this.readProperty('route');
                config.assign_ip = '1';
                config.allow_subnet = '0';
            }
        }

        config.client_to_client = this.readBoolProperty('client-to-client');
        config.duplicate_cn = this.readBoolProperty('duplicate-cn');

        const keepAlive = this.readProperty('keepalive').split(' ');

        if (keepAlive.length > 0) {
            config.keep_alive = {
                ping: keepAlive[0],
                duration: keepAlive[1],
            };
        }

        config.tls_auth = this.readBoolProperty('tls-auth');
        config.auth_algorithm = this.readProperty('auth');
        config.cipher_algorithm = this.readProperty('cipher');
        config.compress = this.readBoolProperty('compress');
        config.max_clients = this.readProperty('max-clients');
        config.user_privilege = this.readProperty('user');
        config.group_privilege = this.readProperty('group');
        config.persist_key = this.readBoolProperty('persist-key');
        config.persist_tun = this.readBoolProperty('persist-tun');
        config.verb = this.readProperty('verb');
        config.mute = this.readProperty('mute');
        config.explicit_exit_notify = this.readBoolProperty('explicit-exit-notify');

        return config;
    }
}
