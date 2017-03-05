import * as SERVER from '../constants/servers';
import {isUndefined, keyBy} from 'lodash';
import {Map} from 'immutable';

const DEFAULT_STATE = {
    list: Map(keyBy([{'id': 1, 'name': 'Server 1', 'host': '127.0.0.1'}], 'id')),
    setupInProgress: Map()
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SERVER.ADD_SUCCESS:
        case SERVER.EDIT_SUCCESS:
            if (isUndefined(action.payload)) {
                return state;
            }
            const list = state.list.set(+(action.payload.id), action.payload);
            return {...state, list};
        case SERVER.FETCH:
            return {...state, list: Map(keyBy(action.payload, 'id'))};
        case SERVER.SETUP:
            return {...state, setupInProgress: state.setupInProgress.set(String(action.payload.server.id), true)};
        case SERVER.SETUP_FAILURE:
        case SERVER.SETUP_SUCCESS:
            return {...state, setupInProgress: state.setupInProgress.set(String(action.payload.server.id), false)};
        default:
            return state;
    }
};