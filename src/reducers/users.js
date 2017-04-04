import {Map} from 'immutable';
import uuid from 'uuid';
import {omit, isUndefined, forIn} from 'lodash';
import * as USER from '../constants/users';

const DEFAULT_STATE = {
    list: Map().set('1', Map().set('1', {id: '1', name: 'Name', ipAddress: '192.168.0.1'}))
};

export default (state = DEFAULT_STATE, {type, payload}) => {
    switch (type) {
        case USER.ADD:
            if (isUndefined(payload.id)) {
                payload.id = uuid.v1();
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
        case USER.FETCH:
            let new_list = Map();
            forIn(payload, (users, server_id) => {
                forIn(users, (user, user_id) => {
                    new_list = new_list.setIn([server_id, user_id], user);
                })
            });

            return {...state, list: new_list};
        default:
            return state;
    }
};
