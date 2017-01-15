import * as SERVER from '../constants/servers';

const DEFAULT_STATE = {
    list: [{id: 1, name: 'Server 1'}, {id: 2, name: 'Server 2'}]
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SERVER.ADD:
            const list = [].concat(state.list, action.payload);
            return {list};
        case SERVER.EDIT:
            return state;
        case SERVER.FETCH:
            return state;
        default:
            return state;
    }
}
