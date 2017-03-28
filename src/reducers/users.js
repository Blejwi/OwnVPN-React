import {Map} from 'immutable';
import {omit} from 'lodash';
import * as USER from '../constants/users';

const DEFAULT_STATE = {
    list: Map().set('1', Map().set('1', {id: '1', name: 'Name', ipAddress: '192.168.0.1'}))
};

export default (state = DEFAULT_STATE, {type, payload}) => {
    switch (type) {
        case USER.ADD:
            if (isUndefined(payload.id)) {
                payload.id = Math.random().toString(36).substring(20);
            }
            return {
                ...state,
                list: state.list
                    .setIn([payload.serverId, payload.id], omit(payload, ['serverId']))
            };
        case USER.EDIT:
            const user = omit(payload, ['serverId']);
            return {
                ...state,
                list: state.list
                    .updateIn([payload.serverId, payload.id], user)
            };

            return {...state, list: state.list.setIn([payload.serverId, payload.id], user)};
        case USER.REMOVE:
            return {
                ...state,
                list: state.list.removeIn([payload.serverId, payload.id])
            };
        default:
            return state;
    }
};
