import {remote} from 'electron';
import {push} from 'react-router-redux';
import * as AUTH from '../constants/authorization';

export const encrypt = () => ({
    type: AUTH.ENCRYPT,
    payload: null
});

export const decrypt = () => ({
    type: AUTH.DECRYPT,
    payload: null
});

export const newFile = file => dispatch => {
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), filename => {
        dispatch({
            type: AUTH.NEW,
            payload: {...file, filename}
        });

        // TODO: create file

        dispatch(push('/'));
    });
};

export const openFile = file => dispatch => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile']
    }, filename => {
        dispatch({
            type: AUTH.OPEN,
            payload: {...file, filename}
        });

        // TODO: read file then decrypt

        dispatch(push('/'));
    });
};