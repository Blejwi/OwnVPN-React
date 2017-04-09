import {push} from "react-router-redux";
import uuid from "uuid";
import {toastr} from "react-redux-toastr";
import * as SERVER from "../constants/servers";
import SSH from "../core/SSH";
import {add as addLog} from "../actions/logs";
import * as LOG from "../constants/logs";
import {save} from "./authorization";
import {STATUS} from "../constants/servers";

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
    let ssh;
    dispatch({type: SERVER.SETUP, payload: {server}});

    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(addLog(`Server setup failure`, LOG.LEVEL.ERROR, 'SERVER'));
        dispatch(addLog(`${e}`, LOG.LEVEL.ERROR, 'SSH'));
        toastr.error('Server', `Failure during server setup`);
        return dispatch(setupFailure(server));
    }

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

export const updateStatus = server => dispatch => {
    dispatch(addLog(`Checking server (${server.name}) status`, LOG.LEVEL.INFO, 'SERVER'));

    let ssh;
    let payload = {
        serverId: server.id,
        server: {
            level: STATUS.UNKNOWN,
            description: null,
            details: null,
        },
        vpn: {
            level: STATUS.UNKNOWN,
            description: null,
            details: null
        }
    };

    try {
        ssh = new SSH(dispatch, server);
        payload = {
            ...payload,
            server: {
                level: STATUS.OK,
                description: null
            }
        }
    } catch (e) {
        dispatch(addLog(`Error getting server status (${server.name})`, LOG.LEVEL.ERROR, 'SERVER'));
        dispatch(addLog(`${e}`, LOG.LEVEL.ERROR, 'SERVER'));
        return dispatch({
            type: SERVER.STATUS_CHANGE,
            payload
        });
    }

    ssh.get_status().then(({level, description, details}) => {
        dispatch({
            type: SERVER.STATUS_CHANGE,
            payload: {
                ...payload,
                vpn: {
                    level, description, details
                }
            }
        })
    }).catch(e => {
        dispatch({
            type: SERVER.STATUS_CHANGE,
            payload: {
                ...payload,
                server: {
                    level: STATUS.ERROR,
                    description: `Error during VPN status check`,
                    details: `${e}`,
                }
            }
        })
    })
};
