import {remote} from 'electron';
import {push} from 'react-router-redux';
import * as AUTH from '../constants/authorization';
import Encryption from "../core/Encryption";
import {toastr} from 'react-redux-toastr';

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
        let encryption = new Encryption(filename, file.password, false);

        // Create actual file
        encryption.save([], 'w').then(() => {
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
        try {
            let encryption = new Encryption(file, file.password);
            dispatch({
                type: AUTH.OPEN,
                payload: {...file, filename}
            });
            toastr.error('Authorization', 'Successfully created opened file');
            dispatch(push('/'));
        } catch (e) {
            toastr.error('Authorization', `Problem during file opening: ${e}`);
        }
    });
};
