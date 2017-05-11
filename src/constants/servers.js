export const FETCH = 'SERVER_FETCH';

export const ADD_SUCCESS = 'SERVER_ADD_SUCCESS';

export const EDIT_SUCCESS = 'SERVER_EDIT_SUCCESS';
export const UPDATE_CONFIG = 'SERVER_UPDATE_CONFIG';

export const SETUP = 'SERVER_SETUP';
export const SETUP_SUCCESS = 'SERVER_SETUP_SUCCESS';
export const SETUP_FAILURE = 'SERVER_SETUP_FAILURE';

export const STATUS_CHANGE = 'SERVER_STATUS_CHANGE';
export const STATUS_FETCH_START = 'SERVER_STATUS_FETCH_START';

export const AUTH_OPTIONS = [
    { value: 'SHA256', text: 'SHA256' },
    { value: 'SHA512', text: 'SHA512' },
    { value: 'SHA1', text: 'SHA1' },
];

export const CIPHER_OPTIONS = [
    { value: 'BF-CBC', text: 'BF-CBC' },
    { value: 'AES-128-CBC', text: 'AES-128-CBC' },
    { value: 'DES-EDE3-CBC', text: 'DES-EDE3-CBC' },
];

export const PROTOCOL_OPTIONS = [
    { value: 'tcp', text: 'tcp' },
    { value: 'udp', text: 'udp' },
];

export const DEV_OPTIONS = [
    { value: 'tun', text: 'tun - routed IP tunnel' },
    { value: 'tap', text: 'tap - ethernet tunnel' },
];

export const YES_NO_OPTIONS = [
    { value: '1', text: 'Yes' },
    { value: '0', text: 'No' },
];

export const LOG_LEVEL_OPIONS = [
    { value: '0', text: '0' },
    { value: '1', text: '1' },
    { value: '2', text: '2' },
    { value: '3', text: '3' },
    { value: '4', text: '4' },
    { value: '5', text: '5' },
    { value: '6', text: '6' },
    { value: '7', text: '7' },
    { value: '8', text: '8' },
    { value: '9', text: '9' },
];

export const TOPOLOGY_OPTIONS = [
    { value: 'none', text: 'none' },
    { value: 'subnet', text: 'subnet (recommended)' },
    { value: 'net30', text: 'net30 (not recommended)' },
    { value: 'p2p', text: 'p2p' },
];

export const STATUS = {
    OK: 'SERVER_STATUS_OK',
    WARNING: 'SERVER_STATUS_WARNING',
    ERROR: 'SERVER_STATUS_ERROR',
    UNKNOWN: 'SERVER_STATUS_UNKNOWN',
};

export const DEFAULT_SERVER_STATUS = {
    server: {
        level: STATUS.UNKNOWN,
    },
    vpn: {
        level: STATUS.UNKNOWN,
    },
    users: {
        level: STATUS.UNKNOWN,
    },
};

export const UPDATE_SERVER_STATUS_CACHE_TIME = 5 * 60 * 1000; // Every 5 minutes

export const MODE = {
    SERVER: 'server',
    BRIDGE: 'bridge',
};

export const DEFAULT_SERVER_CONFIG = {
    local_ip_address: '',
    port: 1194,
    protocol: 'udp',
    dev: 'tun',
    topology: 'net30',
    server_mode: MODE.SERVER,
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
