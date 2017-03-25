
const DEFAULT_STATE = {
    sidebar_active: null
};

export default (state = DEFAULT_STATE, {type, payload}) => {
    switch (type) {
        case '@@router/LOCATION_CHANGE':
            let regexp = new RegExp(/\/server\/(?:show|edit)\/([^\/]+)/);
            let result = regexp.exec(payload.pathname);
            if (result) {
                return {
                    ...state,
                    sidebar_active: result[1]
                }
            } else if (payload.pathname == '/server/add') {
                return {
                    ...state,
                    sidebar_active: 'add'
                }
            }
            return {...DEFAULT_STATE};
        default:
            return state;
    }
};
