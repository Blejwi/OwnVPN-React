import { toastr } from 'react-redux-toastr';
import { swal } from 'react-redux-sweetalert';
import 'sweetalert/dist/sweetalert.css';
import * as USER from '../constants/users';
import SSH from '../core/SSH';
import { add as addLog } from './logs';
import { setupSuccess as setupSuccessServer, setupFailure as setupFailureServer } from './servers';
import { save } from './authorization';
import * as LOG from '../constants/logs';
import * as SERVER from '../constants/servers';
import { compileMessage } from '../utils/messages';

/**
 * Function used to add user
 * @param {object} user User object
 */
export const add = user => (dispatch) => {
    dispatch({
        type: USER.ADD,
        payload: user,
    });
    dispatch(save());
};

/**
 * Function used to edit user
 * @param {object} user User object
 */
export const edit = user => (dispatch) => {
    dispatch({
        type: USER.EDIT,
        payload: user,
    });
    dispatch(save());
};

/**
 * Function used to remove user
 * @param {object} server Server that user is assigned to
 * @param {object} user User object
 */
const confirmedRemove = (server, user) => ({
    type: USER.REMOVE,
    payload: {
        serverId: server.id,
        id: user.id,
    },
});

/**
 * Function used to remove user files from destination server
 * @param {object} server Server object
 * @param {object} user User object
 */
const removeUserFiles = (server, user) => (dispatch) => {
    dispatch({ type: SERVER.SETUP, payload: { server } });
    let ssh;

    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(addLog('Delete failure', LOG.LEVEL.ERROR, 'FILE'));
        dispatch(addLog(compileMessage(e), LOG.LEVEL.ERROR, 'SSH'));
        toastr.error('User', compileMessage(`There was a problem during deleting user (${user.name}) files`, e));
        return dispatch(setupFailureServer(server));
    }

    ssh.deleteClientFiles(user).then(() => {
        toastr.success('User', `Successfully deleted user (${user.name}) files`);
        dispatch(confirmedRemove(server, user));
        dispatch(setupSuccessServer(server));
        dispatch(save());
    }).catch((e) => {
        toastr.error('User', compileMessage(`There was a problem during deleting user (${user.name}) files`, e));
        dispatch(setupFailureServer(server));
    });
};

/**
 * Function used to show confirmation popup about deleting user
 * @param {object} server Server that user belongs to
 * @param {object} user User object to be deleted
 */
export const remove = (server, user) => (dispatch) => {
    dispatch(swal({
        title: 'Delete',
        type: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        text: 'Do you want do delete all files from server for user?',
        showCancelButton: true,
        closeOnConfirm: true,
        onConfirm: () => {
            dispatch(removeUserFiles(server, user));
        },
        onCancel: () => {
            dispatch(confirmedRemove(server, user));
            dispatch(save());
        },
        allowOutsideClick: true,
        onOutsideClick: () => {
        },
        onEscapeKey: () => {
        },
    }));
};

/**
 * Function called after successful user setup
 * @param {object} user User object
 * @param {object} serverId Id of server that user belongs to
 */
const setupSuccess = (user, serverId) => ({
    type: USER.SETUP_SUCCESS,
    payload: {
        user,
        serverId,
    },
});

/**
 * Function called after failed user setup
 * @param {object} user User object
 */
const setupFailure = user => ({
    type: USER.SETUP_FAILURE,
    payload: {
        user,
    },
});

/**
 * Function used to run user setup on destination server.
 * @param {function} dispatch Redux dispatch function
 * @param {object} server Server object
 * @param {object} user User object
 */
const setupClientPromise = (dispatch, server, user) => new Promise((resolve, reject) => {
    let ssh;
    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(addLog(compileMessage(e), LOG.LEVEL.ERROR, 'SSH'));
        return reject();
    }

    ssh.setupClient(user)
            .then(resolve)
            .catch(reject);
});

/**
 * Function used to run user setup on destination server.
 * @param {function} dispatch Redux dispatch function
 * @param {object} server Server object
 * @param {object} user User object
 * @param {bool} changeServerProgress Indicated if serverSetupSuccess action should be called
 */
const setupClientPromiseResolve = (dispatch, server, user, changeServerProgress) => {
    dispatch({ type: USER.SETUP, payload: { server, user } });
    return setupClientPromise(dispatch, server, user)
        .then(() => {
            dispatch(addLog(`Client (${user.name}) setup success`, LOG.LEVEL.INFO, 'USER'));
            toastr.success('User', `Successful client setup (${user.name})`);
            if (changeServerProgress) {
                dispatch(setupSuccessServer(server));
            }
            dispatch(setupSuccess(user, server.id));
            return dispatch(save());
        })
        .catch(() => {
            dispatch(addLog(`Client (${user.name}) setup failure`, LOG.LEVEL.ERROR, 'USER'));
            toastr.error('User', `Failure during client setup (${user.name})`);
            if (changeServerProgress) {
                dispatch(setupFailureServer(server));
            }
            return dispatch(setupFailure(user));
        });
};

/**
 * Function used to trigger setup of client on server
 * @param {object} server Server object
 * @param {object} user User object
 */
export const setupClient = (server, user) => (dispatch) => {
    dispatch({ type: SERVER.SETUP, payload: { server } });
    setupClientPromiseResolve(dispatch, server, user, true);
};

/**
 * Wrapper function for running setup on all server users, one by one
 * @param {function} dispatch Redux dispatch function
 * @param {object} server Server object
 * @param {object} users User object
 * @returns {Promise.<T>}
 */
const setupAllClientsRecursive = (dispatch, server, users) => {
    const user = users[0];
    if (user) {
        return setupClientPromiseResolve(dispatch, server, user, false)
            .then(() => setupAllClientsRecursive(dispatch, server, users.splice(1)))
            .catch(e => dispatch(addLog(compileMessage(`Failure during client (${user.name}) setup:`, e))));
    }
};


/**
 * Function that runs OpenVPN setup on server for all clients recursively
 * @param {object} server Server object
 * @param {object[]} users List of users to setup on server
 */
export const setupAllClients = (server, users) => (dispatch) => {
    dispatch({ type: SERVER.SETUP, payload: { server } });
    setupAllClientsRecursive(dispatch, server, users).then(() => {
        dispatch(setupSuccessServer(server));
    }).catch(() => {
        dispatch(setupFailureServer(server));
    });
};


/**
 * Function used to download user ovpn configuration file
 * @param {object} server Server object
 * @param {object} user User object
 */
export const downloadConfiguration = (server, user) => (dispatch) => {
    dispatch({ type: SERVER.SETUP, payload: { server } });
    let ssh;

    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(addLog('Download failure', LOG.LEVEL.ERROR, 'FILE'));
        dispatch(addLog(compileMessage(e), LOG.LEVEL.ERROR, 'SSH'));
        toastr.error('User', 'Failure during file download');
        return dispatch(setupFailureServer(server));
    }

    ssh.downloadConfiguration(user).then(() => {
        toastr.success('Download', 'Successfully downloaded ovpn file');
        dispatch(setupSuccessServer(server));
    }).catch((e) => {
        toastr.error('Download', compileMessage('There was a problem during file download', e));
        dispatch(addLog(e, LOG.LEVEL.ERROR, 'FILE'));
        dispatch(setupFailureServer(server));
    });
};

/**
 * Load users list to state
 * @param {object[]} users List of users to add
 */
export const fetch = users => ({
    type: USER.FETCH,
    payload: users,
});
