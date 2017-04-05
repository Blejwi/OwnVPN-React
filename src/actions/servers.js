import {push} from "react-router-redux";
import uuid from "uuid";
import {toastr} from "react-redux-toastr";
import * as SERVER from "../constants/servers";
import SSH from "../core/SSH";
import {add as addLog} from "../actions/logs";
import * as LOG from "../constants/logs";
import {save} from "./authorization";

export const fetch = (servers) => ({
    type: SERVER.FETCH,
    payload: servers
});

const addSuccess = server => dispatch => {
    dispatch({
        type: SERVER.ADD_SUCCESS,
        payload: {
            server
        }
    });
    dispatch(save());
};

export const add = server => dispatch => {
    server.id = uuid.v1();
    dispatch(addSuccess(server));
    dispatch(push(`/server/show/${server.id}`));
};

const editSuccess = server => dispatch => {
    dispatch({
        type: SERVER.EDIT_SUCCESS,
        payload: {
            server
        }
    });
    dispatch(save());
};

export const edit = (server) => dispatch => {
    dispatch(editSuccess(server));
    dispatch(push(`/server/show/${server.id}`));
};

export const setupSuccess = server =>  ({
    type: SERVER.SETUP_SUCCESS,
    payload: {
        server
    }
});

export const setupFailure = server =>  ({
    type: SERVER.SETUP_FAILURE,
    payload: {
        server
    }
});

export const setup = server => dispatch => {
    dispatch({type: SERVER.SETUP, payload: {server}});
    let ssh = new SSH(dispatch, server);

    ssh.setup_server()
        .then(() => {
            dispatch(addLog(`Server setup success`, LOG.LEVEL.INFO, 'SERVER'));
            toastr.success('Server', `Successful server setup`);
            return dispatch(setupSuccess(server));
        })
        .catch(() => {
            dispatch(addLog(`Server setup failure`, LOG.LEVEL.ERROR, 'SERVER'));
            toastr.error('Server', `Failure during server setup`);
            return dispatch(setupFailure(server));
        });
};
