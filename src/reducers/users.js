import {Map} from 'immutable';
import * as USER from '../constants/users';

const DEFAULT_STATE = {
    list: Map()
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