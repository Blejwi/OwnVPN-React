import { isArray, isEmpty, isUndefined, forIn } from 'lodash';
import { MODE } from '../constants/servers';

/**
 * Configuration generator class, used for generating configuration from state config object
 */
export default class ConfigurationGenerator {
    /**
     * Checks if field values is '1'
     * @param field
     * @return {boolean}
     */
    static isOn(field) {
        return field === '1';
    }

    /**
     * Checks if field is set
     * @param field
     * @return {boolean}
     */
    static isSet(field) {
        return !isUndefined(field) && !!field;
    }

    /**
     * Adds ccd line
     * @param {string[]} lines Config lines
     * @param {object} route Route object
     */
    static addCcdRoute(lines, route) {
        lines.push('client-config-dir ccd');
        lines.push(`route ${route.network} ${route.mask}`);
    }

    /**
     * Main generation function user for generating OpenVPN configuration file
     * @param {object} config Config object of server
     * @return {string} Generated OpenVPN config file content
     */
    static generate(config) {
        const lines = [];

        if (!ConfigurationGenerator.isSet(config)) {
            return '';
        }

        if (ConfigurationGenerator.isSet(config.local_ip_address)) {
            lines.push(`local ${config.local_ip_address}`);
        }

        if (ConfigurationGenerator.isSet(config.port)) {
            lines.push(`port ${config.port}`);
        }

        this.addProto(config, lines);
        this.addDev(config, lines);

        lines.push('ca ca.crt');
        lines.push('cert server.crt');
        lines.push('key server.key');
        lines.push('dh dh2048.pem');

        if (ConfigurationGenerator.isSet(config.topology)) {
            lines.push(`topology ${config.topology}`);
        }

        switch (config.server_mode) {
            case MODE.SERVER:
                if (ConfigurationGenerator.isSet(config.server)) {
                    lines.push(`server ${config.server.network} ${config.server.mask}`);
                }
                break;
            case MODE.BRIDGE:
                if (ConfigurationGenerator.isSet(config.server_bridge)) {
                    lines.push(`server-bridge ${config.server_bridge.network} ${config.server_bridge.mask} ${config.server_bridge.start} ${config.server_bridge.end}`);
                }
                break;
            default:
                break;
        }

        if (ConfigurationGenerator.isOn(config.ifconfig_pool_persist)) {
            lines.push('ifconfig-pool-persist ipp.txt');
        }

        if (!isEmpty(config.routes) && isArray(config.routes)) {
            forIn(config.routes, (route) => {
                lines.push(`push "route ${route.network} ${route.mask}"`);
            });
        }

        if (
            ConfigurationGenerator.isOn(config.allow_subnet) &&
            ConfigurationGenerator.isSet(config.allow_subnet_route)
        ) {
            ConfigurationGenerator.addCcdRoute(lines, config.allow_subnet_route);
        }

        if (
            ConfigurationGenerator.isOn(config.assign_ip) &&
            ConfigurationGenerator.isSet(config.assign_ip_route)
        ) {
            ConfigurationGenerator.addCcdRoute(lines, config.assign_ip_route);
        }

        if (ConfigurationGenerator.isSet(config.learn_address)) {
            lines.push(`learn-address ${config.learn_address}`);
        }

        ConfigurationGenerator.addRedirectGateway(lines, config.redirect_gateway);

        if (ConfigurationGenerator.isOn(config.client_to_client)) {
            lines.push('client-to-client');
        }

        if (ConfigurationGenerator.isOn(config.duplicate_cn)) {
            lines.push('duplicate-cn');
        }

        if (ConfigurationGenerator.isSet(config.keep_alive)) {
            lines.push(`keepalive ${config.keep_alive.ping} ${config.keep_alive.duration}`);
        }

        if (ConfigurationGenerator.isOn(config.tls_auth)) {
            lines.push('tls-auth ta.key 0');
        }

        this.addAuth(config, lines);
        this.addCipher(config, lines);

        if (ConfigurationGenerator.isOn(config.compress)) {
            lines.push('compress lz4-v2');
            lines.push('push "compress lz4-v2"');
        }

        if (ConfigurationGenerator.isSet(config.max_clients)) {
            lines.push(`max-clients ${config.max_clients}`);
        }

        this.addPrivilege(config, lines);
        this.addPersist(config, lines);
        this.addVerb(config, lines);
        this.addMute(config, lines);

        if (ConfigurationGenerator.isOn(config.explicit_exit_notify)) {
            lines.push('explicit-exit-notify 1');
        }

        lines.push('status openvpn-status.log');

        return lines.join('\n');
    }

    /**
     * Function used for generating OpenVPN user config
     * @param {object} config Server config
     * @param {object} server Server that user is connected to
     * @param {object} userConfig User config
     * @return {string} OpenVPN user configuration file content
     */
    static generateUser(config, server, userConfig) {
        const lines = ['client'];

        if (!ConfigurationGenerator.isSet(config) || !ConfigurationGenerator.isSet(server)) {
            return '';
        }

        this.addDev(config, lines);
        this.addProto(config, lines);

        if (this.isRemoteServerSet(server, config)) {
            lines.push(`remote ${server.host} ${config.port}`);
        }

        lines.push('resolv-retry infinite');
        lines.push('nobind');

        this.addPrivilege(config, lines);
        this.addPersist(config, lines);

        if (ConfigurationGenerator.isOn(userConfig.httpProxyRetry)) {
            lines.push('http-proxy-retry');
        }

        if (ConfigurationGenerator.isSet(userConfig.httpProxyServer) &&
            ConfigurationGenerator.isSet(userConfig.httpProxyPort)) {
            lines.push(`http-proxy ${userConfig.httpProxyServer} ${userConfig.httpProxyPort}`);
        }

        if (ConfigurationGenerator.isOn(userConfig.muteReplayWarnings)) {
            lines.push('mute-replay-warnings');
        }

        if (ConfigurationGenerator.isOn(config.tls_auth)) {
            lines.push('remote-cert-tls server');
            lines.push('tls-auth ta.key 1');
        }

        this.addCipher(config, lines);

        this.addVerb(config, lines);
        this.addMute(config, lines);

        lines.push('key-direction 1');

        this.addAuth(config, lines);

        return lines.join('\n');
    }

    /**
     * Checks if server address is set
     * @param {object} server Server object
     * @param {object} config Config object
     * @return {boolean}
     */
    static isRemoteServerSet(server, config) {
        return (
            ConfigurationGenerator.isSet(server.host) &&
            ConfigurationGenerator.isSet(config.port)
        );
    }

    /**
     * Adds auth algorithm to config
     * @param {string[]} lines Config lines
     * @param {object} config Config object
     */
    static addAuth(config, lines) {
        if (ConfigurationGenerator.isSet(config.auth_algorithm)) {
            lines.push(`auth ${config.auth_algorithm}`);
        }
    }

    /**
     * Adds mute option to config
     * @param {string[]} lines Config lines
     * @param {object} config Config object
     */
    static addMute(config, lines) {
        if (ConfigurationGenerator.isSet(config.mute)) {
            lines.push(`mute ${config.mute}`);
        }
    }

    /**
     * Adds verb option to config
     * @param {string[]} lines Config lines
     * @param {object} config Config object
     */
    static addVerb(config, lines) {
        if (ConfigurationGenerator.isSet(config.verb)) {
            lines.push(`verb ${config.verb}`);
        }
    }

    /**
     * Adds cipher option to config
     * @param {string[]} lines Config lines
     * @param {object} config Config object
     */
    static addCipher(config, lines) {
        if (ConfigurationGenerator.isSet(config.cipher_algorithm)) {
            lines.push(`cipher ${config.cipher_algorithm}`);
        }
    }

    /**
     * Adds persist option to config
     * @param {string[]} lines Config lines
     * @param {object} config Config object
     */
    static addPersist(config, lines) {
        if (ConfigurationGenerator.isOn(config.persist_key)) {
            lines.push('persist-key');
        }

        if (ConfigurationGenerator.isOn(config.persist_tun)) {
            lines.push('persist-tun');
        }
    }

    /**
     * Adds user and group options to config
     * @param {string[]} lines Config lines
     * @param {object} config Config object
     */
    static addPrivilege(config, lines) {
        if (ConfigurationGenerator.isSet(config.user_privilege)) {
            lines.push(`user ${config.user_privilege}`);
        }

        if (ConfigurationGenerator.isSet(config.group_privilege)) {
            lines.push(`group ${config.group_privilege}`);
        }
    }

    /**
     * Adds proto option to config
     * @param {string[]} lines Config lines
     * @param {object} config Config object
     */
    static addProto(config, lines) {
        if (ConfigurationGenerator.isSet(config.protocol)) {
            lines.push(`proto ${config.protocol}`);
        }
    }

    /**
     * Adds dev option to config
     * @param {string[]} lines Config lines
     * @param {object} config Config object
     */
    static addDev(config, lines) {
        if (ConfigurationGenerator.isSet(config.dev)) {
            lines.push(`dev ${config.dev}`);
        }
    }

    /**
     * Adds redirect gateway option to config
     * @param {string[]} lines Config lines
     * @param {object} redirectGateway Redirect gateway config object
     */
    static addRedirectGateway(lines, redirectGateway) {
        const options = [];

        if (!ConfigurationGenerator.isSet(redirectGateway)) {
            return;
        }

        if (ConfigurationGenerator.isOn(redirectGateway.local)) {
            options.push('local');
        }

        if (ConfigurationGenerator.isOn(redirectGateway.auto_local)) {
            options.push('autolocal');
        }

        if (ConfigurationGenerator.isOn(redirectGateway.def1)) {
            options.push('def1');
        }

        if (ConfigurationGenerator.isOn(redirectGateway.bypass_dhcp)) {
            options.push('bypass-dhcp');
        }

        if (ConfigurationGenerator.isOn(redirectGateway.bypass_dns)) {
            options.push('bypass-dns');
        }

        if (ConfigurationGenerator.isOn(redirectGateway.block_local)) {
            options.push('block-local');
        }

        if (options.length > 0) {
            lines.push(`push "redirect-gateway ${options.join(' ')}"`);
        }
    }
}
