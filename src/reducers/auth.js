import * as AUTH from '../constants/auth';

export default (state = {}, action) => {
    switch (action.type) {
        case AUTH.ENCRYPT:
            return state;
        case AUTH.DECRYPT:
            return state;
        default:
            return state;
    }
}