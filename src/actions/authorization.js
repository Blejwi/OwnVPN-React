import { remote } from 'electron';
import { push } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import { swal } from 'react-redux-sweetalert';
import { filter, uniq, slice } from 'lodash';
import settings from 'electron-settings';
import * as AUTH from '../constants/authorization';
import Encryption, { deleteInstance } from '../core/Encryption';
import store from '../store/index';
import { fetch } from './servers';
import { fetch as fetchUsers } from './users';
import { compileMessage } from '../utils/messages';


/**
 * Save configuration to file
 * @param {bool} closeFileOnSuccess If set, it redirects to login page and dispatch close action
 */
export const save = (closeFileOnSuccess = false) => (dispatch) => {
    const state = store.getState();
    // Get all necessary data from store
    const file = state.auth.file;
    const servers = state.servers.list.toArray();

    let users = {};
    if (state.users.list) {
        users = state.users.list.toJS();
    }

    const encryption = new Encryption(file.filename, file.password);

    // Save data object to file
    encryption.save({
        servers, users,
    }).then(() => {
        toastr.success('Authorization', 'Successfully saved file');
        dispatch({
            type: AUTH.SAVE_SUCCESS,
            payload: null,
        });

        if (closeFileOnSuccess) {
            dispatch({
                type: AUTH.CLOSE,
            });
            dispatch(push('/login'));
        }
    }).catch((e) => {
        toastr.error('Authorization', compileMessage('Problem during file save', e));
        dispatch({
            type: AUTH.SAVE_FAILURE,
            payload: null,
        });
    });
};

/**
 * Adds file to recent files list
 * @param {string} filename File path
 */
export const addRecent = (filename) => {
    let previousConfigFiles = settings.get('recent_config_files') || [];
    previousConfigFiles.unshift(filename);
    previousConfigFiles = slice(filter(uniq(previousConfigFiles), x => !!x), 0, 5);
    settings.set('recent_config_files', previousConfigFiles);
};

/**
 * Function used to load data from given file to state
 * @param {object} file File state object
 * @param {string} filename File path
 */
export const load = (file, filename) => (dispatch) => {
    // Try to open selected file and load it
    try {
        const encryption = new Encryption(filename, file.password);
        encryption.read().then((data) => {
            dispatch(fetch(data.servers));
            dispatch(fetchUsers(data.users));
            dispatch({
                type: AUTH.LOAD_SUCCESS,
                payload: null,
            });
            toastr.success('Authorization', 'Successfully loaded data');
            addRecent(filename);
            dispatch(push('/'));
        }).catch((e) => {
            throw e;
        });
    } catch (e) {
        dispatch({
            type: AUTH.LOAD_FAILURE,
            payload: null,
        });
        toastr.error('Authorization', compileMessage('Problem during file opening', e));
    }
};

/**
 * Function used for creating new configuration file
 * @param {{filename: string, password: string}} file File details
 */
export const newFile = file => (dispatch) => {
    const encryption = new Encryption(file.filename, file.password, false);

    // Create actual file and save initial encrypted empty json
    encryption.save({}, 'w').then(() => {
        dispatch({
            type: AUTH.NEW,
            payload: { ...file },
        });
        toastr.success('Authorization', 'Successfully created new file');
        addRecent(file.filename);
        dispatch(push('/'));
    }).catch((e) => {
        toastr.error('Authorization', compileMessage('Problem during file creation', e));
    });
};

/**
 * Function used to open existing configuration file
 * @param {string} inputFilename Path to configuration file
 */
export const openFilePassword = inputFilename => (dispatch) => {
    const file = {};
    const filename = [].concat(inputFilename)[0];

    dispatch(swal({
        title: 'Password',
        type: 'input',
        inputType: 'password',
        inputPlaceholder: 'Password...',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        text: 'Type password for chosen file',
        showCancelButton: true,
        closeOnConfirm: true,
        onConfirm: (password) => {
            if (!password) {
                toastr.error('Authorization', 'Invalid password');
                return;
            }

            file.password = password;
            dispatch({
                type: AUTH.OPEN,
                payload: {
                    ...file,
                    filename,
                },
            });
            dispatch(load(file, filename));
        },
        onCancel: () => {
        },
        allowOutsideClick: true,
        onOutsideClick: () => {
        },
        onEscapeKey: () => {
        },
    }));
};

/**
 * Opens dialog for choosing configuration file path
 */
export const openFile = () => (dispatch) => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile'],
    }, (filename) => {
        if (!filename) {
            return;
        }

        dispatch(openFilePassword(filename));
    });
};

/**
 * Fetch recently opened files
 */
export const fetchRecent = () => (dispatch) => {
    dispatch({
        type: AUTH.FETCH_RECENT,
        payload: settings.get('recent_config_files') || [],
    });
};


/**
 * Close currently opened file
 */
export const closeFile = () => (dispatch) => {
    dispatch(save(true));
    dispatch({
        type: AUTH.CLEAR_STATE,
    });
    deleteInstance();
};
