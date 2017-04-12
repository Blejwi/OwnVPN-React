import {remote} from 'electron';
import {push} from 'react-router-redux';
import * as AUTH from '../constants/authorization';
import Encryption from "../core/Encryption";
import {toastr} from 'react-redux-toastr';
import store from '../store/index';
import {fetch} from "./servers";
import {fetch as fetch_users} from "./users";
import {swal} from "react-redux-sweetalert";
import {filter, uniq, slice} from "lodash";
import settings from 'electron-settings';

export const save = (closeFileOnSuccess = false) => (dispatch) => {
    const state = store.getState();
    // Get all necessary data from store
    let file = state.auth.file;
    let servers = state.servers.list.toArray();

    let users = {};
    if (state.users.list) {
        users = state.users.list.toJS();
    }

    let encryption = new Encryption(file.filename, file.password);

    // Save data object to file
    encryption.save({
        servers, users
    }).then(() => {
        toastr.success('Authorization', `Successfully saved file`);
        dispatch({
            type: AUTH.SAVE_SUCCESS,
            payload: null
        });

        if (closeFileOnSuccess) {
            dispatch({
                type: AUTH.CLOSE
            });
            dispatch(push('/login'));
        }
    }).catch(e => {
        toastr.error('Authorization', `Problem during file save: ${e}`);
        dispatch({
            type: AUTH.SAVE_FAILURE,
            payload: null
        });
    });
};

export const load = (file, filename) => (dispatch) => {
    // Try to open selected file and load it
    try {
        let encryption = new Encryption(filename, file.password);
        encryption.read().then((data) => {
            dispatch(fetch(data.servers));
            dispatch(fetch_users(data.users));
            dispatch({
                type: AUTH.LOAD_SUCCESS,
                payload: null
            });
            toastr.success('Authorization', 'Successfully loaded data');
            addRecent(filename);
            dispatch(push('/'));
        }).catch(e => {
            throw e;
        });
    } catch (e) {
        dispatch({
            type: AUTH.LOAD_FAILURE,
            payload: null
        });
        toastr.error('Authorization', `Problem during file opening: ${e}`);
    }
};

export const newFile = file => dispatch => {
    let encryption = new Encryption(file.filename, file.password, false);

    // Create actual file and save initial encrypted empty json
    encryption.save({}, 'w').then(() => {
        dispatch({
            type: AUTH.NEW,
            payload: {...file}
        });
        toastr.success('Authorization', 'Successfully created new file');
        addRecent(file.filename);
        dispatch(push('/'));
    }).catch((e) => {
        toastr.error('Authorization', `Problem during file creation: ${e}`);
    });
};

export const openFile = () => dispatch => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile']
    }, filename => {
        if (!filename) {
            return;
        }

        dispatch(openFilePassword(filename));
    });
};

export const openFilePassword = filename => dispatch => {
    let file = {};
    filename = [].concat(filename)[0];

    dispatch(swal({
        title: 'Password',
        type: 'input',
        inputPlaceholder: "Password...",
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        text: 'Type password for chosen file',
        showCancelButton: true,
        closeOnConfirm: true,
        onConfirm: (password) => {
            if (!password) {
                toastr.error('Authorization', `Invalid password`);
                return;
            }

            file.password = password;
            dispatch({
                type: AUTH.OPEN,
                payload: {
                    ...file,
                    filename: filename
                }
            });
            dispatch(load(file, filename));
        },
        onCancel: () => {},
        allowOutsideClick: true,
        onOutsideClick: () => {},
        onEscapeKey: () => {}
    }));
};

export const addRecent = filename => {
    let previous_config_files = settings.get('recent_config_files') || [];
    previous_config_files.unshift(filename);
    previous_config_files = slice(filter(uniq(previous_config_files), x => !!x), 0, 5);
    settings.set('recent_config_files', previous_config_files);
};

export const fetchRecent = () => dispatch => {
    dispatch({
        type: AUTH.FETCH_RECENT,
        payload: settings.get('recent_config_files') || []
    })
};


export const closeFile = () => dispatch => {
    dispatch(save(true));
};
