/* eslint-disable no-case-declarations */
/* eslint-disable no-useless-escape */
const DEFAULT_STATE = {
    sidebar_active: null,
};

const activeRegex = new RegExp(/\/server\/(?:show|edit)\/([^\/]+)/);

export default (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
        case '@@router/LOCATION_CHANGE':
            const result = activeRegex.exec(payload.pathname);
            if (result) {
                return {
                    ...state,
                    sidebar_active: result[1],
                };
            } else if (payload.pathname === '/server/add') {
                return {
                    ...state,
                    sidebar_active: 'add',
                };
            }
            return { ...DEFAULT_STATE };
        default:
            return state;
    }
};
