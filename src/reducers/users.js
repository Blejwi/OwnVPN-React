import {Map} from 'immutable';
import * as USER from '../constants/users';

const DEFAULT_STATE = {
    list: Map().set('1', Map().set('1', {id: '1', name: 'Name', ipAddress: '192.168.0.1'}))
};

export default (state = DEFAULT_STATE, {type}) => {
    switch (type) {
        case USER.ADD:
            return state;
        case USER.EDIT:
            return state;
        default:
            return state;
    }
};
