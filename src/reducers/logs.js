import * as LOG from '../constants/logs';
import {List} from "immutable";

const DEFAULT_STATE = {
    list: List([]),
    collapsed: true
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case LOG.ADD:
            return {...state, list: state.list.push(action.payload)};
        case LOG.TOGGLE_COLLAPSE:
            return {...state, collapsed: !state.collapsed};
        case LOG.CLEAR:
            return {...state, list: List([])};
        default:
            return state;
    }
}
