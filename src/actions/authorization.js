import * as AUTH from '../constants/authorization';

export const encrypt = () => ({
    type: AUTH.ENCRYPT,
    payload: null
});

export const decrypt = () => ({
    type: AUTH.DECRYPT,
    payload: null
});

export const newFile = (payload) => ({
    type: AUTH.NEW,
    payload
});

export const openFile = (payload) => ({
    type: AUTH.OPEN,
    payload
});