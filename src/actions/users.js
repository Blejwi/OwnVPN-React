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
        id: user.id
    }
});

const removeUserFiles = (server, user) => dispatch => {
    dispatch({type: SERVER.SETUP, payload: {server}});
    let ssh;

    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(addLog(`Delete failure`, LOG.LEVEL.ERROR, 'FILE'));
        dispatch(addLog(`${e}`, LOG.LEVEL.ERROR, 'SSH'));
        toastr.error('User', `There was a problem during deleting user (${user.name}) files: ${e}`);
        return dispatch(setupFailureServer(server));
    }

    ssh.delete_client_files(user).then(() => {
        toastr.success('User', `Successfully deleted user (${user.name}) files`);
        dispatch(_remove(server, user));
        dispatch(setupSuccessServer(server));
        dispatch(save());
    }).catch(e => {
        toastr.error('User', `There was a problem during deleting user (${user.name}) files: ${e}`);
        dispatch(setupFailureServer(server));
    })
};

export const remove = (server, user) => dispatch => {
    dispatch(swal({
        title: 'Delete',
        type: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        text: 'Do you want do delete all files from server for user?',
        showCancelButton: true,
        closeOnConfirm: true,
        onConfirm: (dismiss) => {
            dispatch(removeUserFiles(server, user));
        },
        onCancel: (dismiss) => {
            dispatch(_remove(server, user));
            dispatch(save());
        },
        allowOutsideClick: true,
        onOutsideClick: () => {},
        onEscapeKey: () => {}
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
    let ssh;
    dispatch({type: SERVER.SETUP, payload: {server}});
    dispatch({type: USER.SETUP, payload: {server, user}});

    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(addLog(`Client setup failure`, LOG.LEVEL.ERROR, 'USER'));
        dispatch(addLog(`${e}`, LOG.LEVEL.ERROR, 'SSH'));
        toastr.error('User', `Failure during client setup`);
        dispatch(setupFailureServer(server));
        return dispatch(setupFailure(user));
    }

    ssh.setup_client(user)
        .then(() => {
            dispatch(addLog(`Client setup success`, LOG.LEVEL.INFO, 'USER'));
            toastr.success('User', `Successful client setup`);
            dispatch(setupSuccessServer(server));
            return dispatch(setupSuccess(user));
        })
        .catch(() => {
            dispatch(addLog(`Client setup failure`, LOG.LEVEL.ERROR, 'USER'));
            toastr.error('User', `Failure during client setup`);
            dispatch(setupFailureServer(server));
            return dispatch(setupFailure(user));
        });
};

export const downloadOvpnFile = (server, user) => dispatch => {
    dispatch({type: SERVER.SETUP, payload: {server}});
    let ssh;

    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(addLog(`Download failure`, LOG.LEVEL.ERROR, 'FILE'));
        dispatch(addLog(`${e}`, LOG.LEVEL.ERROR, 'SSH'));
        toastr.error('User', `Failure during file download`);
        return dispatch(setupFailureServer(server));
    }

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
