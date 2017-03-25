import * as USER from '../constants/users';
import SSH from "../core/SSH";
import {add as addLog} from '../actions/logs';
import * as LOG from "../constants/logs";

export const add = user => ({
    type: USER.ADD,
    payload: user
});

export const edit = user => ({
    type: USER.EDIT,
    payload: user
});

export const remove = (server, user) => ({
    type: USER.REMOVE,
    payload: {
        serverId: server.id,
        userName: user.name
    }
});

export const download = user => ({
    type: USER.DOWNLOAD,
    payload: user
});

const setupSuccess = (user) =>  ({
    type: USER.SETUP_SUCCESS,
    payload: {
        user
    }
});

const setupFailure = (user) =>  ({
    type: USER.SETUP_FAILURE,
    payload: {
        user
    }
});

export const setupClient = (server, user) => dispatch => {
    dispatch({type: USER.SETUP, payload: {server, user}});
    let ssh = new SSH(dispatch, server);

    ssh.setup_client(user)
        .then(() => {
            dispatch(addLog(`Client setup success`, LOG.LEVEL.INFO, 'USER'));
            return dispatch(setupSuccess(server));
        })
        .catch(() => {
            dispatch(addLog(`Client setup failure`, LOG.LEVEL.ERROR, 'USER'));
            return dispatch(setupFailure(server));
        });
};
