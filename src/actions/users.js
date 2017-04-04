import * as USER from "../constants/users";
import SSH from "../core/SSH";
import {toastr} from "react-redux-toastr";
import {add as addLog} from "./logs";
import {setupSuccess as setupSuccessServer, setupFailure as setupFailureServer} from "./servers";
import {save} from "./authorization";
import * as LOG from "../constants/logs";
import * as SERVER from "../constants/servers";
import 'sweetalert/dist/sweetalert.css';
import { swal } from 'react-redux-sweetalert';

export const add = user => dispatch => {
    dispatch({
        type: USER.ADD,
        payload: user
    });
    dispatch(save());
};

export const edit = user => dispatch => {
    dispatch({
        type: USER.EDIT,
        payload: user
    });
    dispatch(save());
};

const _remove = (server, user) => ({
    type: USER.REMOVE,
    payload: {
        serverId: server.id,
        userName: user.name
    }
});

export const remove = (server, user) => dispatch => {
    dispatch(swal({
        title: 'Delete',
        type: 'warning',
        text: 'Do you want do delete all files from server for user?',
        showCancelButton: true,
        closeOnConfirm: true,
        onConfirm: () => {
            // TODO remove from server
            dispatch(_remove(server, user));
        },
        onCancel: () => {
            dispatch(_remove(server, user));
        }
    }));
};

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
    dispatch({type: SERVER.SETUP, payload: {server}});
    dispatch({type: USER.SETUP, payload: {server, user}});
    let ssh = new SSH(dispatch, server);

    ssh.setup_client(user)
        .then(() => {
            dispatch(addLog(`Client setup success`, LOG.LEVEL.INFO, 'USER'));
            dispatch(setupSuccessServer(server));
            return dispatch(setupSuccess(user));
        })
        .catch(() => {
            dispatch(addLog(`Client setup failure`, LOG.LEVEL.ERROR, 'USER'));
            dispatch(setupFailureServer(server));
            return dispatch(setupFailure(user));
        });
};

export const downloadOvpnFile = (server, user) => dispatch => {
    dispatch({type: SERVER.SETUP, payload: {server}});
    let ssh = new SSH(dispatch, server);
    ssh.download_ovpn_file(user).then(() => {
        toastr.success('Download', `Successfully downloaded ovpn file`);
        dispatch(setupSuccessServer(server));
    }).catch(e => {
        toastr.error('Download', `There was a problem during file download: ${e}`);
        dispatch(setupFailureServer(server));
    });
};

export const fetch = (servers) => ({
    type: USER.FETCH,
    payload: servers
});
