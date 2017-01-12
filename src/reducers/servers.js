import * as SERVER from '../constants/servers';

export default (state = {}, action) => {
    switch (action.type) {
        case SERVER.ADD:
            return state;
        case SERVER.EDIT:
            return state;
        case SERVER.FETCH:
            return state;
        default:
            return state;
    }
}
