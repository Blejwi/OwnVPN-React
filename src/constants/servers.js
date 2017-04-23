export const FETCH = 'SERVER_FETCH';

export const ADD = 'SERVER_ADD';
export const ADD_SUCCESS = 'SERVER_ADD_SUCCESS';

export const EDIT = 'SERVER_EDIT';
export const EDIT_SUCCESS = 'SERVER_EDIT_SUCCESS';

export const SETUP = 'SERVER_SETUP';
export const SETUP_SUCCESS = 'SERVER_SETUP_SUCCESS';
export const SETUP_FAILURE = 'SERVER_SETUP_FAILURE';

export const STATUS_CHANGE = 'SERVER_STATUS_CHANGE';
export const STATUS_FETCH_START = 'SERVER_STATUS_FETCH_START';

export const AUTH_OPTIONS = [
    {value: 'SHA256', text: 'SHA256'},
    {value: 'SHA512', text: 'SHA512'},
    {value: 'SHA1', text: 'SHA1'}
];

export const CIPHER_OPTIONS = [
    {value: 'BF-CBC', text: 'BF-CBC'},
    {value: 'AES-128-CBC', text: 'AES-128-CBC'},
    {value: 'DES-EDE3-CBC', text: 'DES-EDE3-CBC'}
];

export const PROTOCOL_OPTIONS = [
    {value: 'tcp', text: 'tcp'},
    {value: 'udp', text: 'udp'}
];

export const DEV_OPTIONS = [
    {value: 'tun', text: 'tun - routed IP tunnel'},
    {value: 'tap', text: 'tap - ethernet tunnel'}
];

export const YES_NO_OPTIONS = [
    {value: '1', text: 'Yes'},
    {value: '0', text: 'No'}
];

export const LOG_LEVEL_OPIONS = [
    {value: '0', text: '0'},
    {value: '1', text: '1'},
    {value: '2', text: '2'},
    {value: '3', text: '3'},
    {value: '4', text: '4'},
    {value: '5', text: '5'},
    {value: '6', text: '6'},
    {value: '7', text: '7'},
    {value: '8', text: '8'},
    {value: '9', text: '9'}
];

export const TOPOLOGY_OPTIONS = [
    {value: 'none', text: 'none'},
    {value: 'subnet', text: 'subnet (recommended)'},
    {value: 'net30', text: 'net30 (not recommended)'},
    {value: 'p2p', text: 'p2p'}
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
    }
};

export const UPDATE_SERVER_STATUS_CACHE_TIME = 60 * 1000;
