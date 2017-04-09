import {createSelector} from 'reselect';
import {Map} from 'immutable';

export const getUsersMap = createSelector([
    state => state.users.list,
    (_, {params}) => params.id
], (users, serverId) => users.get(serverId));

export const getUsersArray = createSelector([
    getUsersMap
], map => Map.isMap(map) ? map.toArray() : []);

export const getUser = createSelector([
    getUsersMap,
    (_, {params}) => params.user_id
], (map, user_id) => map.get(user_id));
