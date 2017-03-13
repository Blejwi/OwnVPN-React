import * as SERVER from '../constants/servers';
import SSH from "../core/SSH";
import {add as addLog} from '../actions/logs';
import * as LOG from "../constants/logs";

export const fetch = () => ({
    type: SERVER.FETCH,
    payload: null
});

const addSuccess = server => ({
    type: SERVER.ADD_SUCCESS,
    payload: {
        server
    }
});

export const add = server => dispatch => {
    // TODO: check connection via ssh, if failure show modal
    dispatch(addSuccess(server));
};

const editSuccess = (server) =>  ({
    type: SERVER.EDIT_SUCCESS,
    payload: {
        server
    }
});

export const edit = (server) => dispatch => {
    // TODO: check connection via ssh, if failure show modal
    dispatch(editSuccess(server));
};

const setupSuccess = (server) =>  ({
    type: SERVER.SETUP_SUCCESS,
    payload: {
        server
    }
});

const setupFailure = (server) =>  ({
    type: SERVER.SETUP_FAILURE,
    payload: {
        server
    }
});

export const setup = (server) => dispatch => {
    dispatch({type: SERVER.SETUP, payload: {server}});
    let ssh = new SSH(dispatch, server);

    ssh.setup_server()
        .then(() => {
            dispatch(addLog(`Server setup success`, LOG.LEVEL.INFO, 'SERVER'));
            return dispatch(setupSuccess(server));
        })
        .catch(() => {
            dispatch(addLog(`Server setup failure`, LOG.LEVEL.ERROR, 'SERVER'));
            return dispatch(setupFailure(server));
        });
};
