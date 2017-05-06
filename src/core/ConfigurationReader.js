import { MODE } from '../constants/servers';

class ConfigurationReader {
    readProperty(key) {
        const regex = new RegExp(`^${key} (.*)$`, 'm');
        const matches = regex.exec(this.content);

        if (matches !== null) {
            return matches[1];
        }

        return '';
    }

    isPropertySet(key) {
        const regex = new RegExp(`^${key}$`, 'm');
        return regex.test(this.content);
    }

    readBoolProperty(key) {
        if (this.readProperty(key).length > 0 || this.isPropertySet(key)) {
            return '1';
        }
        return '0';
    }

    readIpAndMask(key) {
        const server = this.readProperty(key).split(' ');

        return {
            network: server[0],
            mask: server[1],
        };
    }

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

    read(content) {
        this.content = content;
        const config = {};

        config.local_ip_address = this.readProperty('local');
        config.port = this.readProperty('port');
        config.proto = this.readProperty('proto');
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
        config.learn_address = this.readBoolProperty('learn-address');
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

        config.learn_address = this.readBoolProperty('learn-address');
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
        config.auth = this.readBoolProperty('auth');
        config.cipher_algorithm = this.readBoolProperty('cipher');
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
