import { Map } from 'immutable';
import uuid from 'uuid';
import { omit, isUndefined, forIn } from 'lodash';
import * as USER from '../constants/users';

const DEFAULT_STATE = {
    list: Map(),
    setupInProgress: Map()
};

export default (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
        case USER.ADD:
            if (isUndefined(payload.id)) {
                // eslint-disable-next-line no-param-reassign
                payload.id = uuid.v1();
            }
            return {
                ...state,
                list: state.list
                    .setIn(
                        [payload.serverId, payload.id], {
                            ...omit(payload, ['serverId']),
                            ranSetup: false,
                        },
                    ),
            };
        case USER.EDIT:
            return { ...state, list: state.list.setIn([payload.serverId, payload.id], omit(payload, ['serverId'])) };
        case USER.SETUP:
            return {
                ...state,
                setupInProgress: state.setupInProgress.set(payload.user.id, true),
            };
        case USER.SETUP_SUCCESS:
            return {
                ...state,
                list: state.list.updateIn(
                    [payload.serverId, payload.user.id],
                    item => ({
                        ...item,
                        ranSetup: true,
                    }),
                ),
                setupInProgress: state.setupInProgress.set(payload.user.id, false),
            };
        case USER.SETUP_FAILURE:
            return {
                ...state,
                setupInProgress: state.setupInProgress.set(payload.user.id, false),
            };
        case USER.REMOVE:
            return {
                ...state,
                list: state.list.removeIn([payload.serverId, payload.id]),
            };
        // eslint-disable-next-line
        case USER.FETCH:
            let newList = Map();
            forIn(payload, (users, serverId) => {
                forIn(users, (user, userId) => {
                    newList = newList.setIn([serverId, userId], user);
                });
            });

            return { ...state, list: newList };
        default:
            return state;
    }
};
