import * as AUTH from '../constants/auth';

export const encrypt = () => ({
    type: AUTH.ENCRYPT,
    payload: null
});

export const decrypt = () => ({
    type: AUTH.DECRYPT,
    payload: null
});
