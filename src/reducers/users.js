import {Map} from 'immutable';
import {omit} from 'lodash';
import * as USER from '../constants/users';

const DEFAULT_STATE = {
    list: Map().set('1', Map().set('Name', {name: 'Name', ipAddress: '192.168.0.1'}))
};

export default (state = DEFAULT_STATE, {type, payload}) => {
    switch (type) {
        case USER.ADD:
            return {
                ...state,
                list: state.list
                    .setIn([payload.serverId, payload.name], omit(payload, ['serverId']))
            };
        case USER.EDIT:
            const user = omit(payload, ['prevName', 'serverId']);

            if (payload.prevName != payload.name) {
                return {
                    ...state,
                    list: state.list
                        .removeIn([payload.serverId, payload.prevName])
                        .setIn([payload.serverId, payload.name], user)
                };
            }

            return {...state, list: state.list.setIn([payload.serverId, payload.name], user)};
        case USER.REMOVE:
            return {
                ...state,
                list: state.list.removeIn([payload.serverId, payload.userName])
            };
        default:
            return state;
    }
};
