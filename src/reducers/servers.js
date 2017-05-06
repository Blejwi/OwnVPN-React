import moment from 'moment';
import uuid from 'uuid';
import { isUndefined, keyBy, omit } from 'lodash';
import { Map } from 'immutable';
import * as SERVER from '../constants/servers';

const DEFAULT_STATE = {
    list: Map(),
    setupInProgress: Map(),
    status: Map(),
    statusFetch: Map(),
};

export default (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
        case SERVER.ADD_SUCCESS:
        case SERVER.EDIT_SUCCESS:
            if (isUndefined(payload)) {
                return state;
            }

            if (isUndefined(payload.server.id)) {
// eslint-disable-next-line no-param-reassign
                payload.server.id = uuid.v1();
            }
            return { ...state, list: state.list.set(payload.server.id, payload.server) };

        case SERVER.UPDATE_CONFIG:
            return {
                ...state,
                list: state.list.update(payload.server.id, (item) => {
                    return {
                        ...item,
                        config: payload.config,
                    }
                }),
            };
        case SERVER.FETCH:
            return { ...state, list: Map(keyBy(payload, 'id')) };
        case SERVER.SETUP:
            return {
                ...state,
                setupInProgress: state.setupInProgress.set(String(payload.server.id), true),
            };
        case SERVER.SETUP_FAILURE:
        case SERVER.SETUP_SUCCESS:
            return {
                ...state,
                setupInProgress: state.setupInProgress.set(String(payload.server.id), false),
            };
        case SERVER.STATUS_CHANGE:
            return {
                ...state,
                status: state.status.set(payload.serverId, {
                    ...state.status.get(payload.serverId, {}),
                    ...omit(payload, ['serverId']),
                    updated: moment().toDate().getTime(),
                }),
                statusFetch: state.statusFetch.set(payload.serverId, false),
            };
        case SERVER.STATUS_FETCH_START:
            return {
                ...state,
                statusFetch: state.statusFetch.set(payload.serverId, true),
            };
        default:
            return state;
    }
};
