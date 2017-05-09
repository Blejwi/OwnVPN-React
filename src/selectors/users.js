import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const getSetupInProgressMap = state => state.users.setupInProgress;

export const getUsersMap = createSelector([
    state => state.users.list,
    (_, { params }) => params.id,
], (users, serverId) => users.get(serverId));

export const getUsersArray = createSelector([
    getUsersMap,
], (map) => {
    if (Map.isMap(map)) {
        return map.toArray();
    }

    return [];
});

export const getUser = createSelector([
    getUsersMap,
    (_, { params }) => params.user_id,
], (map, userId) => map.get(userId));
