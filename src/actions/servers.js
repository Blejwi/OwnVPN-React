import { push } from 'react-router-redux';
import uuid from 'uuid';
import os from 'os';
import { toastr } from 'react-redux-toastr';
import { swal } from 'react-redux-sweetalert';
import { spawn } from 'child_process';
import { capitalize, lowerCase } from 'lodash';
import store from '../store/index';
import * as SERVER from '../constants/servers';
import SSH from '../core/SSH';
import { add as addLog } from '../actions/logs';
import * as LOG from '../constants/logs';
import { save } from './authorization';
import ConfigurationReader from '../core/ConfigurationReader';
import ConfigurationGenerator from '../core/ConfigurationGenerator';
import { compileMessage } from '../utils/messages';
import { getServer } from '../selectors/servers';

/**
 * Load servers to state from param
 * @param {object[]} servers List of servers to be loaded
 */
export const fetch = servers => ({
    type: SERVER.FETCH,
    payload: servers,
});

/**
 * Function called on successful server add
 * @param {object} server Server that was added
 */
const addSuccess = server => (dispatch) => {
    dispatch({
        type: SERVER.ADD_SUCCESS,
        payload: {
            server,
        },
    });
    dispatch(save());
};

/**
 * Function adding server to list of servers
 * @param {object} inputServer Server to be added
 */
export const add = inputServer => (dispatch) => {
    const server = { ...inputServer, id: uuid.v1() };
    dispatch(addSuccess(server));
    dispatch(push(`/server/show/${server.id}`));
};

/**
 * Function called on successful server edit
 * @param {object} server Server that was edited
 */
const editSuccess = server => (dispatch) => {
    dispatch({
        type: SERVER.EDIT_SUCCESS,
        payload: {
            server,
        },
    });
    dispatch(save());
};

/**
 * Function editing existing server
 * @param {object} server Server to be edited
 */
export const edit = server => (dispatch) => {
    dispatch(editSuccess(server));
    dispatch(push(`/server/show/${server.id}`));
};

/**
 * Function called on successful server setup
 * @param {object} server Server that was setup
 */
export const setupSuccess = server => ({
    type: SERVER.SETUP_SUCCESS,
    payload: {
        server,
    },
});

/**
 * Function called on failed server setup
 * @param {object} server Server that was setup
 */
export const setupFailure = server => ({
    type: SERVER.SETUP_FAILURE,
    payload: {
        server,
    },
});

/**
 * Function used to trigger setup of server.
 * Connection via SSH is made to destination server and configuration of OpenVPN is processed.
 * @param {object} server Server to be setup
 */
export const setup = server => (dispatch) => {
    let ssh;
    dispatch({ type: SERVER.SETUP, payload: { server } });

    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(addLog('Server setup failure', LOG.LEVEL.ERROR, 'SERVER'));
        dispatch(addLog(compileMessage(e), LOG.LEVEL.ERROR, 'SSH'));
        toastr.error('Server', 'Failure during server setup');
        return dispatch(setupFailure(server));
    }

    ssh.setupServer()
        .then(() => {
            dispatch(addLog('Server setup success', LOG.LEVEL.INFO, 'SERVER'));
            toastr.success('Server', 'Successful server setup');
            return dispatch(setupSuccess(server));
        })
        .catch(() => {
            dispatch(addLog('Server setup failure', LOG.LEVEL.ERROR, 'SERVER'));
            toastr.error('Server', 'Failure during server setup');
            return dispatch(setupFailure(server));
        });
};

/**
 * Function called periodically or manually by user to refresh server status and statistics
 * @param {string} id Id of server to be refreshed
 */
export const updateStatus = ({ id }) => (dispatch) => {
    const state = store.getState();
    const server = getServer(state, { params: { id } });

    dispatch(addLog(`Checking server (${server.name}) status`, LOG.LEVEL.INFO, 'SERVER'));
    dispatch({
        type: SERVER.STATUS_FETCH_START,
        payload: {
            serverId: server.id,
        },
    });

    let ssh;
    let payload = {
        serverId: server.id,
        server: {
            level: SERVER.STATUS.UNKNOWN,
            description: null,
            details: null,
        },
        vpn: {
            level: SERVER.STATUS.UNKNOWN,
            description: null,
            details: null,
        },
        users: {
            level: SERVER.STATUS.UNKNOWN,
            description: null,
            details: null,
        },
        config: {
            different: null,
        },
    };

    try {
        ssh = new SSH(dispatch, server);
        payload.server.level = SERVER.STATUS.OK;
    } catch (e) {
        dispatch(addLog(`Error getting server status (${server.name})`, LOG.LEVEL.ERROR, 'SERVER'));
        dispatch(addLog(compileMessage(e), LOG.LEVEL.ERROR, 'SERVER'));
        return dispatch({
            type: SERVER.STATUS_CHANGE,
            payload,
        });
    }

    ssh.statistics.getMachineStatus().then((details) => {
        payload.server.details = details;
    }).catch((e) => {
        payload.server.details = compileMessage('Could not get details', e);
    }).then(() => ssh.statistics.getVpnStatus().then((data) => {
        payload = {
            ...payload,
            vpn: {
                ...data,
            },
        };
    }).catch((e) => {
        payload = {
            ...payload,
            server: {
                level: SERVER.STATUS.ERROR,
                description: 'Error during VPN status check',
                details: compileMessage(e),
            },
        };
    }))
        .then(() => ssh.statistics.getUsersStats().then(({ level, description, details }) => {
            payload = {
                ...payload,
                users: {
                    level, description, details,
                },
            };
        }).catch((e) => {
            payload = {
                ...payload,
                users: {
                    level: SERVER.STATUS.ERROR,
                    description: 'Error during getting VPN statistics',
                    details: compileMessage(e),
                },
            };
        }))
        .then(() => ssh.getConfigFromServer().then((response) => {
            const config = ConfigurationGenerator.generate(server.config);
            payload = {
                ...payload,
                config: {
                    different: config !== response.stdout,
                },
            };
        }).catch(() => null))
        .then(() => dispatch({ type: SERVER.STATUS_CHANGE, payload }))
        .catch(() => dispatch({ type: SERVER.STATUS_CHANGE, payload }));
};

/**
 * Function showing popup windows with configuration preview
 * @param {string} config Configuration of OpenVPN server
 */
export const preview = config => (dispatch) => {
    dispatch(swal({
        title: 'Preview configuration',
        text: `<pre>${config}</pre>`,
        html: true,
    }));
};

/**
 * Function used to open SSH terminal for user in OS.
 * Available only on Linux platform.
 * @param {object} server Server to be connected to
 */
export const handleSSHTerminal = server => (dispatch) => {
    if (os.platform() !== 'linux') {
        return;
    }

    let sshCommand;
    if (server.key) {
        sshCommand = `ssh -i "${server.key}" ${server.username}@${server.host} -p ${server.port}`;
    } else {
        sshCommand = `ssh ${server.username}@${server.host} -p ${server.port}`;
    }

    try {
        spawn('x-terminal-emulator', ['-e', 'bash', '-c', `${sshCommand};bash`]);
    } catch (e) {
        dispatch(addLog(compileMessage('Could not open ssh in terminal', e)));
    }
};

/**
 * Function showing preview of config with possibility of accepting and rejecting.
 * After confirmation server config is updated in state.
 * @param {object} server Server object
 * @param {object} config OpenVPN configuration object
 * @param {function} [callback=null] Callback function called after confirmation
 */
const confirmPreview = (server, config, callback = null) => (dispatch) => {
    setTimeout(() => dispatch(swal({
        title: 'Preview configuration',
        text: `<pre>${ConfigurationGenerator.generate(config)}</pre>`,
        html: true,
        showCancelButton: true,
        closeOnConfirm: true,
        onCancel: () => dispatch(setupSuccess(server)),
        allowOutsideClick: true,
        onOutsideClick: () => dispatch(setupSuccess(server)),
        onEscapeKey: () => dispatch(setupSuccess(server)),
        onConfirm: () => {
            dispatch({
                type: SERVER.UPDATE_CONFIG,
                payload: {
                    server,
                    config,
                },
            });
            dispatch(setupSuccess(server));
            if (callback) {
                callback();
            }
            return dispatch(save());
        },
    })), 200);
};

/**
 * Function used to download OpenVPN configuration from server, parse it
 * and update config object in state.
 * Before update shows popup for user with confirm and decline options.
 * @param {object} server Server to be updated
 * @param {function} callback Function to be called after accepting changes
 */
export const loadConfigFromServer = (server, callback = null) => (dispatch) => {
    dispatch(swal({
        title: 'Config path',
        type: 'input',
        inputValue: '/etc/openvpn/server.conf',
        inputPlaceholder: 'Path...',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        text: 'Type path of config file on server',
        showCancelButton: true,
        closeOnConfirm: true,
        onConfirm: (path) => {
            let ssh;
            dispatch({ type: SERVER.SETUP, payload: { server } });

            try {
                ssh = new SSH(dispatch, server);
            } catch (e) {
                dispatch(addLog(e, LOG.LEVEL.ERROR, 'SSH'));
                toastr.error('Server', 'Failure during getting file');
                return dispatch(setupFailure(server));
            }

            ssh.catFile(path).then((response) => {
                const configReader = new ConfigurationReader();
                const config = configReader.read(response.stdout);

                return dispatch(confirmPreview(server, config, callback));
            }).catch((e) => {
                dispatch(addLog(e, LOG.LEVEL.ERROR, 'SERVER'));
                toastr.error('Server', 'Failure during getting file');
                return dispatch(setupFailure(server));
            });
        },
        onCancel: () => {},
        allowOutsideClick: true,
        onOutsideClick: () => {},
        onEscapeKey: () => {},
    }));
};

/**
 * Shows popup with textfield for user to paste OpenVPN config. Configuration is parsed and save
 * in state
 * @param {object} server Server to be updated
 */
export const loadConfigTextArea = server => (dispatch) => {
    dispatch(swal({
        title: 'Paste config',
        text: '<textarea id=\'config-text\' class="sweet-alert-textarea"></textarea>',
        html: true,
        inputPlaceholder: 'Paste file here...',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        closeOnConfirm: true,
        onConfirm: () => {
            const val = document.getElementById('config-text').value;
            if (val) {
                const configReader = new ConfigurationReader();
                const config = configReader.read(val);

                return dispatch(confirmPreview(server, config));
            }
        },
        onCancel: () => {},
        allowOutsideClick: true,
        onOutsideClick: () => {},
        onEscapeKey: () => {},
    }));
};

// Server actions

/**
 * Function called on action failure
 * @param {object} server Server object
 * @param {string} action Action name
 * @param {Error} error Error object
 */
const actionDefaultError = (server, action, error) => (dispatch) => {
    const message = `Failure during ${action} action`;
    dispatch(addLog(message, LOG.LEVEL.ERROR, 'SERVER'));
    if (error) {
        dispatch(addLog(compileMessage(error), LOG.LEVEL.ERROR, 'SSH'));
    }
    toastr.error('Server', message);
    return dispatch(setupFailure(server));
};

/**
 * Wrapper function for running server actions
 * @param {string} action Action name to be performed
 * @param {object} server Server object
 */
const runAction = (action, server) => (dispatch) => {
    let ssh;
    dispatch({ type: SERVER.SETUP, payload: { server } });

    try {
        ssh = new SSH(dispatch, server);
    } catch (e) {
        dispatch(actionDefaultError(server, action, e));
        return Promise.reject(null);
    }

    return ssh.runAction(action);
};

/**
 * Reboot server action
 * @param {object} server Server object
 */
export const rebootServer = server => (dispatch) => {
    const action = 'reboot';

    dispatch(runAction(action, server)).then(() => {
        toastr.success('Server', 'Reboot command sent');
        dispatch(setupSuccess(server));
    }).catch((e) => {
        if (e.stderr && e.stderr.indexOf('password for') !== -1) {
            toastr.success('Server', 'Reboot command sent');
            return dispatch(setupSuccess(server));
        }
        return dispatch(actionDefaultError(server, 'reboot', e));
    });
};

/**
 * Reboot server action
 * @param {object} server Server object
 * @param {string} action Action name to be performed
 */
export const vpnAction = (server, action) => (dispatch) => {
    const successMessage = `${capitalize(lowerCase(action))} command sent`;

    dispatch(runAction(action, server)).then(() => {
        toastr.success('Server', successMessage);
        dispatch(setupSuccess(server));
    }).catch(e => dispatch(actionDefaultError(server, action, e)));
};

/**
 * Function used to upload server config.
 * After uploading config restarts OpenVPN server to apply changes.
 * @param {object} server Server object
 * @param {function} [callback=null] Callback function called after successful upload
 */
export const reuploadConfig = (server, callback = null) => (dispatch) => {
    const successMessage = 'Config successfully uploaded and service restarted';
    const action = 'uploadConfig';

    dispatch(runAction(action, server)).then(() => {
        toastr.success('Server', successMessage);
        dispatch(setupSuccess(server));
        if (callback) {
            callback();
        }
    }).catch(e => dispatch(actionDefaultError(server, action, e)));
};
