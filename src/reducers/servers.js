import * as SERVER from '../constants/servers';
import uuid from 'uuid';
import {isUndefined, keyBy, omit} from 'lodash';
import {Map} from 'immutable';

const DEFAULT_STATE = {
    list: Map(keyBy([{
        id: '1',
        name:'Server 1',
        country: 'PL',
        province: 'WLKP',
        host: 'ec2-52-36-196-2.us-west-2.compute.amazonaws.com',
        port: 22,
        username: 'ubuntu',
        password: '',
        key: '~/.ssh/vpn_rsa',
        config: {
            port: '1194',
            protocol: 'udp',
            dev: 'tun',
            tls_auth: true,
            user_privilege: 'nobody',
            group_privilege: 'nogroup',
            max_clients: '',
            auth_algorithm: 'SHA256',
            cipher_algorithm: 'BF-CBC',
        }
    }], 'id')),
    setupInProgress: Map(),
    status: Map()
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SERVER.ADD_SUCCESS:
        case SERVER.EDIT_SUCCESS:
            if (isUndefined(action.payload)) {
                return state;
            }
            if (isUndefined(action.payload.server.id)) {
                action.payload.server.id = uuid.v1();
            }
            const list = state.list.set(action.payload.server.id, action.payload.server);
            return {...state, list};
        case SERVER.FETCH:
            return {...state, list: Map(keyBy(action.payload, 'id'))};
        case SERVER.SETUP:
            return {...state, setupInProgress: state.setupInProgress.set(String(action.payload.server.id), true)};
        case SERVER.SETUP_FAILURE:
        case SERVER.SETUP_SUCCESS:
            return {...state, setupInProgress: state.setupInProgress.set(String(action.payload.server.id), false)};
        case SERVER.STATUS_CHANGE:
            return {
                ...state,
                status: state.status.set(action.payload.serverId, {
                    ...state.status.get(action.payload.serverId, {}),
                    ...omit(action.payload, ['serverId'])
                })
            };
        default:
            return state;
    }
};
