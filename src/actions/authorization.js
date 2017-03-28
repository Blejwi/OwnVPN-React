import {remote} from 'electron';
import {push} from 'react-router-redux';
import * as AUTH from '../constants/authorization';
import Encryption from "../core/Encryption";
import {toastr} from 'react-redux-toastr';
import store from '../store/index';
import {fetch} from "./servers";
import {fetch as fetch_users} from "./users";

export const save = () => (dispatch) => {
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
    }).catch(e => {
        toastr.error('Authorization', `Problem during file save: ${e}`);
        dispatch({
            type: AUTH.SAVE_FAILURE,
            payload: null
        });
    });
};

export const load = (file, filename) => (dispatch)=> {
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
            dispatch(push('/'));
        }).catch(e => {throw e;});
    } catch (e) {
        dispatch({
            type: AUTH.LOAD_FAILURE,
            payload: null
        });
        toastr.error('Authorization', `Problem during file opening: ${e}`);
    }
};

export const newFile = file => dispatch => {
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), filename => {
        let encryption = new Encryption(filename, file.password, false);

        // Create actual file and save initial encrypted empty json
        encryption.save({}, 'w').then(() => {
            dispatch({
                type: AUTH.NEW,
                payload: {...file, filename}
            });
            toastr.success('Authorization', 'Successfully created new file');

            dispatch(push('/'));
        }).catch((e) => {
            toastr.error('Authorization', `Problem during file creation: ${e}`);
        });
    });
};

export const openFile = file => dispatch => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile']
    }, filename => {
        dispatch({
            type: AUTH.OPEN,
            payload: {...file, filename: filename[0]}
        });
        dispatch(load(file, filename[0]));
    });
};
