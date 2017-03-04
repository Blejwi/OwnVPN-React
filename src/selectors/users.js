import {createSelector} from 'reselect';

export const getUsersMap = createSelector([
    state => state.users.list,
    (_, {params}) => params.serverId
], (users, serverId) => users.get(serverId));

export const getUser = createSelector([
    getUsersMap,
    (_, {params}) => params.id
], (map, id) => map.get(id));