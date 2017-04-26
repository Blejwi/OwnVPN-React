import {isArray, isEmpty, isUndefined, forIn} from 'lodash';
import {MODE} from '../constants/servers';

export default class ConfigurationGenerator {
    static _isOn(field) {
        return field === '1';
    }

    static _isSet(field) {
        return !isUndefined(field) && field;
    }

    static _addCcdRoute(lines, route) {
        lines.push('client-config-dir ccd');
        lines.push(`route ${route.network} ${route.mask}`);
    }

    static generate(config) {
        const lines = [];

        if (!ConfigurationGenerator._isSet(config)) {
            return '';
        }

        if (ConfigurationGenerator._isSet(config.local_ip_address)) {
            lines.push(`local ${config.local_ip_address}`);
        }

        if (ConfigurationGenerator._isSet(config.port)) {
            lines.push(`port ${config.port}`);
        }

        if (ConfigurationGenerator._isSet(config.protocol)) {
            lines.push(`proto ${config.protocol}`);
        }

        if (ConfigurationGenerator._isSet(config.dev)) {
            lines.push(`dev ${config.dev}`)
        }

        lines.push('ca ca.crt');
        lines.push('cert server.crt');
        lines.push('key server.key');
        lines.push('dh dh2048.pem');

        if (ConfigurationGenerator._isSet(config.topology)) {
            lines.push(`topology ${config.topology}`);
        }

        switch (config.server_mode) {
            case MODE.SERVER:
                if (ConfigurationGenerator._isSet(config.server)) {
                    lines.push(`server ${config.server.network} ${config.server.mask}`);
                }
                break;
            case MODE.BRIDGE:
                if (ConfigurationGenerator._isSet(config.server_bridge)) {
                    lines.push(`server-bridge ${config.server_bridge.network} ${config.server_bridge.mask} ${config.server_bridge.start} ${config.server_bridge.end}`);
                }
                break;
            default:
                break;
        }

        if (ConfigurationGenerator._isOn(config.ifconfig_pool_persist)) {
            lines.push('ifconfig-pool-persist ipp.txt');
        }

        if (!isEmpty(config.routes) && isArray(config.routes)) {
            forIn(config.routes, route => {
                lines.push(`push "route ${route.network} ${route.mask}"`);
            });
        }

        if (ConfigurationGenerator._isOn(config.allow_subnet) && ConfigurationGenerator._isSet(config.allow_subnet_route)) {
            ConfigurationGenerator._addCcdRoute(lines, config.allow_subnet_route);
        }

        if (ConfigurationGenerator._isOn(config.assign_ip) && ConfigurationGenerator._isSet(config.assign_ip_route)) {
            ConfigurationGenerator._addCcdRoute(lines, config.assign_ip_route);
        }

        if (ConfigurationGenerator._isSet(config.learn_address)) {
            lines.push(`learn-address ./script`);
        }

        ConfigurationGenerator._addRedirectGateway(lines, config.redirect_gateway);

        if (ConfigurationGenerator._isOn(config.client_to_client)) {
            lines.push('client-to-client');
        }

        if (ConfigurationGenerator._isOn(config.duplicate_cn)) {
            lines.push('duplicate-cn');
        }

        if (ConfigurationGenerator._isSet(config.keep_alive)) {
            lines.push(`keepalive ${config.keep_alive.ping} ${config.keep_alive.duration}`)
        }

        if (ConfigurationGenerator._isOn(config.tls_auth)) {
            lines.push('tls-auth ta.key 0');
        }

        if (ConfigurationGenerator._isSet(config.auth_algorithm)) {
            lines.push(`auth ${config.auth_algorithm}`)
        }

        if (ConfigurationGenerator._isSet(config.cipher_algorithm)) {
            lines.push(`cipher ${config.cipher_algorithm}`)
        }

        if (ConfigurationGenerator._isOn(config.compress)) {
            lines.push('compress lz4-v2');
            lines.push('push "compress lz4-v2"');
        }

        if (ConfigurationGenerator._isSet(config.max_clients)) {
            lines.push(`max-clients ${config.max_clients}`);
        }

        if (ConfigurationGenerator._isSet(config.user_privilege)) {
            lines.push(`user ${config.user_privilege}`);
        }

        if (ConfigurationGenerator._isSet(config.group_privilege)) {
            lines.push(`group ${config.group_privilege}`);
        }

        if (ConfigurationGenerator._isOn(config.persist_key)) {
            lines.push('persist-key');
        }

        if (ConfigurationGenerator._isOn(config.persist_tun)) {
            lines.push('persist-tun');
        }

        if (ConfigurationGenerator._isSet(config.verb)) {
            lines.push(`verb ${config.verb}`);
        }

        if (ConfigurationGenerator._isSet(config.mute)) {
            lines.push(`mute ${config.mute}`);
        }

        if (ConfigurationGenerator._isOn(config.explicit_exit_notify)) {
            lines.push('explicit-exit-notify 1');
        }

        return lines.join('\n');
    }

    static _addRedirectGateway(lines, redirect_gateway) {
        const options = [];

        if (!ConfigurationGenerator._isSet(redirect_gateway)) {
            return;
        }

        if (ConfigurationGenerator._isOn(redirect_gateway.local)) {
            options.push('local');
        }

        if (ConfigurationGenerator._isOn(redirect_gateway.auto_local)) {
            options.push('autolocal');
        }

        if (ConfigurationGenerator._isOn(redirect_gateway.def1)) {
            options.push('def1');
        }

        if (ConfigurationGenerator._isOn(redirect_gateway.bypass_dhcp)) {
            options.push('bypass-dhcp');
        }

        if (ConfigurationGenerator._isOn(redirect_gateway.bypass_dns)) {
            options.push('bypass-dns');
        }

        if (ConfigurationGenerator._isOn(redirect_gateway.block_local)) {
            options.push('block-local');
        }

        if (options.length > 0) {
            lines.push(`push "redirect-gateway ${options.join(' ')}"`)
        }
    }
}
