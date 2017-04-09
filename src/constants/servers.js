export const FETCH = 'SERVER_FETCH';

export const ADD = 'SERVER_ADD';
export const ADD_SUCCESS = 'SERVER_ADD_SUCCESS';

export const EDIT = 'SERVER_EDIT';
export const EDIT_SUCCESS = 'SERVER_EDIT_SUCCESS';

export const SETUP = 'SERVER_SETUP';
export const SETUP_SUCCESS = 'SERVER_SETUP_SUCCESS';
export const SETUP_FAILURE = 'SERVER_SETUP_FAILURE';

export const STATUS_CHANGE = 'SERVER_STATUS_CHANGE';

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
    {value: 'tun', text: 'tun'},
    {value: 'tap', text: 'tap'}
];

export const YES_NO_OPTIONS = [
    {value: true, text: 'Yes'},
    {value: false, text: 'No'}
];

export const STATUS = {
    OK: 'SERVER_STATUS_OK',
    WARNING: 'SERVER_STATUS_WARNING',
    ERROR: 'SERVER_STATUS_ERROR',
    UNKNOWN: 'SERVER_STATUS_UNKNOWN',
};
