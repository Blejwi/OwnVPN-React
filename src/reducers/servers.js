import * as SERVER from '../constants/servers';
import {isUndefined, keyBy} from 'lodash';
import {Map} from 'immutable';

const DEFAULT_STATE = {
    list: Map(keyBy([{'id': 1, 'name': 'Server 1'}], 'id'))
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SERVER.ADD:
        case SERVER.EDIT:
            if (isUndefined(action.payload)) {
                return state;
            }
            const list = state.list.set(+(action.payload.id), action.payload);
            return {...state, list};
        case SERVER.FETCH:
            return {...state, list: Map(keyBy(action.payload, 'id'))};
        default:
            return state;
    }
}
;