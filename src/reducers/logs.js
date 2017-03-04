import * as LOG from '../constants/logs';
import {List} from "immutable";

const DEFAULT_STATE = {
    list: List([])
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case LOG.ADD:
            return {...state, list: state.list.push(action.payload)};
        default:
            return state;
    }
}