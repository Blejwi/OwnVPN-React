import { Map, List } from 'immutable';
import sha256 from 'crypto-js/sha256';
import * as AUTH from '../constants/authorization';

const DEFAULT_STATE = {
    file: Map({
        path: './config',
        filename: 'severs',
        decrypted: false,
        password: '',
        dirty: false,
        open: false,
    }),
    recentFiles: List(),
};

const hash = password => sha256(`${password}shOYpJ11dpoEsmll3xnl`);

export default (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
        case AUTH.SAVE_SUCCESS:
            return {
                ...state,
                file: state.file
                    .set('decrypted', false)
                    .set('dirty', false),
            };
        case AUTH.LOAD_SUCCESS:
            return {
                ...state,
                file: state.file
                    .set('decrypted', true),
            };
        case AUTH.NEW:
            return {
                ...state,
                file: state.file
                    .set('filename', payload.filename)
                    .set('dirty', true)
                    .set('open', true)
                    .set('password', hash(payload.password)),
            };
        case AUTH.OPEN:
            return {
                ...state,
                file: state.file
                    .set('filename', payload.filename)
                    .set('open', true)
                    .set('password', hash(payload.password)),
            };
        case AUTH.CLOSE:
            return {
                ...state,
                file: state.file.set('open', false),
            };
        case AUTH.FETCH_RECENT:
            return {
                ...state,
                recentFiles: List(payload),
            };
        default:
            return state;
    }
};
