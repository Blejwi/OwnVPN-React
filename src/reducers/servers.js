import * as SERVER from '../constants/servers';
import moment from 'moment';
import uuid from 'uuid';
import {isUndefined, keyBy, omit} from 'lodash';
import {Map} from 'immutable';

const DEFAULT_SERVER_CONFIG = {
    local_ip_address: '',
    port: 1194,
    protocol: 'udp',
    dev: 'tun',
    topology: 'net30',
    server_mode: 'server',
    server: {
        network: '10.8.0.0',
        mask: '255.255.255.0'
    },
    server_bridge: {
        network: '10.8.0.4',
        mask: '255.255.255.0',
        start: '10.8.0.50',
        end: '10.8.0.100'
    },
    allow_subnet: false,
    assign_ip: false,
    ifconfig_pool_persist: true,
    routes: [],
    learn_address: '',
    redirect_gateway: {
        local: false,
        auto_local: false,
        def1: false,
        bypass_dhcp: false,
        bypass_dns: false,
        bypass_local: false,
        block_local: false
    },
    client_to_client: true,
    duplicate_cn: false,
    keep_alive: {
        ping: 10,
        during: 120
    },
    tls_auth: true,
    auth_algorithm: 'SHA256',
    cipher_algorithm: 'BF-CBC',
    compress: false,
    max_clients: '',
    user_privilege: 'nobody',
    group_privilege: 'nogroup',
    persist_key: true,
    persist_tun: true,
    verb: '3',
    mute: '',
    explicit_exit_notify: true
};

const DEFAULT_STATE = {
    list: Map(keyBy([{
        id: '1',
        name:'Server 1',
        country: 'PL',
        province: 'WLKP',
        host: 'ec2-52-36-196-2.us-west-2.compute.amazonaws.com',
        port: 22,
        username: 'ubuntu',
        password: '',
        key: '~/.ssh/vpn_rsa',
        config: {
            ...DEFAULT_SERVER_CONFIG
        }
    }], 'id')),
    setupInProgress: Map(),
    status: Map(),
    statusFetch: Map(),
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SERVER.ADD_SUCCESS:
        case SERVER.EDIT_SUCCESS:
            if (isUndefined(action.payload)) {
                return state;
            }
            if (isUndefined(action.payload.server.id)) {
                action.payload.server.id = uuid.v1();
            }
            const list = state.list.set(action.payload.server.id, action.payload.server);
            return {...state, list};
        case SERVER.FETCH:
            return {...state, list: Map(keyBy(action.payload, 'id'))};
        case SERVER.SETUP:
            return {...state, setupInProgress: state.setupInProgress.set(String(action.payload.server.id), true)};
        case SERVER.SETUP_FAILURE:
        case SERVER.SETUP_SUCCESS:
            return {...state, setupInProgress: state.setupInProgress.set(String(action.payload.server.id), false)};
        case SERVER.STATUS_CHANGE:
            return {
                ...state,
                status: state.status.set(action.payload.serverId, {
                    ...state.status.get(action.payload.serverId, {}),
                    ...omit(action.payload, ['serverId']),
                    updated: moment().toDate().getTime()
                }),
                statusFetch: state.statusFetch.set(action.payload.serverId, false)
            };
        case SERVER.STATUS_FETCH_START:
            return {
                ...state,
                statusFetch: state.statusFetch.set(action.payload.serverId, true)
            };
        default:
            return state;
    }
};
