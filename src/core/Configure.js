import {isEmpty, isArray, forIn} from 'lodash';
import {MODE} from '../constants/servers';

export default class Configure {
    private config;

    constructor(config) {
        this.config = config;
    }

    static _isOn(field) {
        return field === '1';
    }

    static _addCcdRoute(lines, route) {
        lines.push('client-config-dir ccd');
        lines.push(`route ${route.network} ${route.mask}`);
    }

    generate() {
        const lines = [];

        if (!isEmpty(this.config.local_ip_address)) {
            lines.push(`local ${this.config.local_ip_address}`);
        }

        if (!isEmpty(this.config.port)) {
            lines.push(`port ${this.config.port}`);
        }

        if (!isEmpty(this.config.protocol)) {
            lines.push(`proto ${this.config.protocol}`);
        }

        if (!isEmpty(this.config.dev)) {
            lines.push(`dev ${this.config.dev}`)
        }

        lines.push('ca ca.crt');
        lines.push('cert server.crt');
        lines.push('key server.key');
        lines.push('dh dh2048.pem');

        if (!isEmpty(this.config.topology)) {
            lines.push(`topology ${this.config.topology}`);
        }

        switch (this.config.server_mode) {
            case MODE.SERVER:
                if (!isEmpty(this.config.server)) {
                    lines.push(`server ${this.config.server.network} ${this.config.server.mask}`);
                }
                break;
            case MODE.BRIDGE:
                if (!isEmpty(this.config.server_bridge)) {
                    lines.push(`server-bridge ${this.config.server_bridge.network} ${this.config.server_bridge.mask} ${this.config.server_bridge.start} ${this.config.server_bridge.end}`);
                }
                break;
            default:
                break;
        }

        if (Configure._isOn(this.config.ifconfig_pool_persist)) {
            lines.push('ifconfig-pool-persist ipp.txt');
        }

        if (!isEmpty(this.config.routes) && isArray(this.config.routes)) {
            forIn(this.config.routes, route => {
                lines.push(`push "route ${route.network} ${route.mask}"`);
            });
        }

        if (Configure._isOn(this.config.allow_subnet) && !isEmpty(this.config.allow_subnet_route)) {
            Configure._addCcdRoute(lines, this.config.allow_subnet_route);
        }

        if (Configure._isOn(this.config.assign_ip) && !isEmpty(this.config.assign_ip_route)) {
            Configure._addCcdRoute(lines, this.config.assign_ip_route);
        }

        if (!isEmpty(this.config.learn_address)) {
            lines.push(`learn-address ./script`);
        }

        Configure._addRedirectGateway(lines, this.config.redirect_gateway);

        if (Configure._isOn(this.config.client_to_client)) {
            lines.push('client-to-client');
        }

        if (Configure._isOn(this.config.duplicate_cn)) {
            lines.push('duplicate-cn');
        }

        if (!isEmpty(this.config.keep_alive)) {
            lines.push(`keepalive ${this.config.keep_alive.ping} ${this.config.keep_alive.duration}`)
        }

        if (Configure._isOn(this.config.tls_auth)) {
            lines.push('tls-auth ta.key 0');
        }

        if (!isEmpty(this.config.auth_algorithm)) {
            lines.push(`auth ${this.config.auth_algorithm}`)
        }

        if (!isEmpty(this.config.cipher_algorithm)) {
            lines.push(`cipher ${this.config.cipher_algorithm}`)
        }

        if (Configure._isOn(this.config.compress)) {
            lines.push('compress lz4-v2');
            lines.push('push "compress lz4-v2"');
        }

        if (!isEmpty(this.config.max_clients)) {
            lines.push(`max-clients ${this.config.max_clients}`);
        }

        if (!isEmpty(this.config.user_privilege)) {
            lines.push(`user ${this.config.user_privilege}`);
        }

        if (!isEmpty(this.config.group_privilege)) {
            lines.push(`group ${this.config.group_privilege}`);
        }

        if (Configure._isOn(this.config.persist_key)) {
            lines.push('persist-key');
        }

        if (Configure._isOn(this.config.persist_tun)) {
            lines.push('persist-tun');
        }

        if (!isEmpty(this.config.verb)) {
            lines.push(`verb ${this.config.verb}`);
        }

        if (!isEmpty(this.config.mute)) {
            lines.push(`mute ${this.config.mute}`);
        }

        if (Configure._isOn(this.config.explicit_exit_notify)) {
            lines.push('explicit-exit-notify 1');
        }

        return lines.join('\n');
    }

    static _addRedirectGateway(lines, redirect_gateway) {
        const options = [];

        if (redirect_gateway.local) {
            options.push('local');
        }

        if (redirect_gateway.auto_local) {
            options.push('autolocal');
        }

        if (redirect_gateway.def1) {
            options.push('def1');
        }

        if (redirect_gateway.bypass_dhcp) {
            options.push('bypass-dhcp');
        }

        if (redirect_gateway.bypass_dns) {
            options.push('bypass-dns');
        }

        if (redirect_gateway.block_local) {
            options.push('block-local');
        }

        if (options.length > 0) {
            lines.push(`push "redirect-gateway ${options.join(' ')}"`)
        }
    }
}
