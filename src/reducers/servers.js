import moment from 'moment';
import uuid from 'uuid';
import { isUndefined, keyBy, omit } from 'lodash';
import { Map } from 'immutable';
import * as SERVER from '../constants/servers';

const DEFAULT_SERVER_CONFIG = {
    local_ip_address: '',
    port: 1194,
    protocol: 'udp',
    dev: 'tun',
    topology: 'net30',
    server_mode: SERVER.MODE.SERVER,
    server: {
        network: '10.8.0.0',
        mask: '255.255.255.0',
    },
    server_bridge: {
        network: '10.8.0.4',
        mask: '255.255.255.0',
        start: '10.8.0.50',
        end: '10.8.0.100',
    },
    allow_subnet: '0',
    allow_subnet_route: {
        network: '',
        mask: '',
    },
    assign_ip: '0',
    assign_ip_route: {
        network: '',
        mask: '',
    },
    ifconfig_pool_persist: '1',
    routes: [],
    learn_address: '',
    redirect_gateway: {
        local: '0',
        auto_local: '0',
        def1: '0',
        bypass_dhcp: '0',
        bypass_dns: '0',
        bypass_local: '0',
        block_local: '0',
    },
    client_to_client: '1',
    duplicate_cn: '0',
    keep_alive: {
        ping: 10,
        duration: 120,
    },
    tls_auth: '1',
    auth_algorithm: 'SHA256',
    cipher_algorithm: 'BF-CBC',
    compress: '0',
    max_clients: '',
    user_privilege: 'nobody',
    group_privilege: 'nogroup',
    persist_key: '1',
    persist_tun: '1',
    verb: '3',
    mute: '',
    explicit_exit_notify: '1',
};

const DEFAULT_STATE = {
    list: Map(keyBy([{
        id: '1',
        name: 'Server 1',
        country: 'PL',
        province: 'WLKP',
        host: 'ec2-52-36-196-2.us-west-2.compute.amazonaws.com',
        port: 22,
        username: 'ubuntu',
        password: '',
        key: '~/.ssh/vpn_rsa',
        config: {
            ...DEFAULT_SERVER_CONFIG,
        },
    }], 'id')),
    setupInProgress: Map(),
    status: Map(),
    statusFetch: Map(),
};

export default (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
        case SERVER.ADD_SUCCESS:
        case SERVER.EDIT_SUCCESS:
            if (isUndefined(payload)) {
                return state;
            }

            if (isUndefined(payload.server.id)) {
// eslint-disable-next-line no-param-reassign
                payload.server.id = uuid.v1();
            }
            return { ...state, list: state.list.set(payload.server.id, payload.server) };
        case SERVER.FETCH:
            return { ...state, list: Map(keyBy(payload, 'id')) };
        case SERVER.SETUP:
            return {
                ...state,
                setupInProgress: state.setupInProgress.set(String(payload.server.id), true),
            };
        case SERVER.SETUP_FAILURE:
        case SERVER.SETUP_SUCCESS:
            return {
                ...state,
                setupInProgress: state.setupInProgress.set(String(payload.server.id), false),
            };
        case SERVER.STATUS_CHANGE:
            return {
                ...state,
                status: state.status.set(payload.serverId, {
                    ...state.status.get(payload.serverId, {}),
                    ...omit(payload, ['serverId']),
                    updated: moment().toDate().getTime(),
                }),
                statusFetch: state.statusFetch.set(payload.serverId, false),
            };
        case SERVER.STATUS_FETCH_START:
            return {
                ...state,
                statusFetch: state.statusFetch.set(payload.serverId, true),
            };
        default:
            return state;
    }
};
