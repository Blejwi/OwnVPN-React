import { push } from 'react-router-redux';
import uuid from 'uuid';
import os from 'os';
import { toastr } from 'react-redux-toastr';
import { swal } from 'react-redux-sweetalert';
import { spawn } from 'child_process';
import { capitalize, lowerCase } from 'lodash';
import * as SERVER from '../constants/servers';
import SSH from '../core/SSH';
import { add as addLog } from '../actions/logs';
import * as LOG from '../constants/logs';
import { save } from './authorization';
import ConfigurationReader from '../core/ConfigurationReader';
import ConfigurationGenerator from '../core/ConfigurationGenerator';
import { compileMessage } from '../utils/messages';

export const fetch = servers => ({
    type: SERVER.FETCH,
    payload: servers,
});

const addSuccess = server => (dispatch) => {
    dispatch({
        type: SERVER.ADD_SUCCESS,
        payload: {
            server,
        },
    });
    dispatch(save());
};

export const add = inputServer => (dispatch) => {
    const server = { ...inputServer, id: uuid.v1() };
    dispatch(addSuccess(server));
    dispatch(push(`/server/show/${server.id}`));
};

const editSuccess = server => (dispatch) => {
    dispatch({
        type: SERVER.EDIT_SUCCESS,
        payload: {
            server,
        },
    });
    dispatch(save());
};

export const edit = server => (dispatch) => {
    dispatch(editSuccess(server));
    dispatch(push(`/server/show/${server.id}`));
};

export const setupSuccess = server => ({
    type: SERVER.SETUP_SUCCESS,
    payload: {
        server,
    },
});

export const setupFailure = server => ({
    type: SERVER.SETUP_FAILURE,
    payload: {
        server,
    },
});

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

export const updateStatus = server => (dispatch) => {
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
        .then(() => dispatch({ type: SERVER.STATUS_CHANGE, payload }))
        .catch(() => dispatch({ type: SERVER.STATUS_CHANGE, payload }));
};

export const preview = config => (dispatch) => {
    dispatch(swal({
        title: 'Preview configuration',
        text: `<pre>${config}</pre>`,
        html: true,
    }));
};

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

const confirmPreview = (server, config) => (dispatch) => {
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
            return dispatch(save());
        },
    })), 200);
};

export const loadConfigFromServer = server => (dispatch) => {
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

                return dispatch(confirmPreview(server, config));
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


const actionDefaultError = (server, action, error) => (dispatch) => {
    const message = `Failure during ${action} action`;
    dispatch(addLog(message, LOG.LEVEL.ERROR, 'SERVER'));
    if (error) {
        dispatch(addLog(compileMessage(error), LOG.LEVEL.ERROR, 'SSH'));
    }
    toastr.error('Server', message);
    return dispatch(setupFailure(server));
};

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

export const vpnAction = (server, action) => (dispatch) => {
    const successMessage = `${capitalize(lowerCase(action))} command sent`;

    dispatch(runAction(action, server)).then(() => {
        toastr.success('Server', successMessage);
        dispatch(setupSuccess(server));
    }).catch(e => dispatch(actionDefaultError(server, action, e)));
};

export const reuploadConfig = server => (dispatch) => {
    const successMessage = 'Config successfully uploaded and service restarted';
    const action = 'uploadConfig';

    dispatch(runAction(action, server)).then(() => {
        toastr.success('Server', successMessage);
        dispatch(setupSuccess(server));
    }).catch(e => dispatch(actionDefaultError(server, action, e)));
};
