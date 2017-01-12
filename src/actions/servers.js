import * as SERVER from '../constants/servers';

export const fetch = () => ({
    type: SERVER.FETCH,
    payload: null
});

export const add = server => ({
    type: SERVER.ADD,
    payload: server
});

export const edit = (id, server) => ({
    type: SERVER.EDIT,
    payload: {
        id,
        server
    }
});