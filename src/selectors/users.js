import { createSelector } from 'reselect';
import { Map } from 'immutable';

/**
 * Checks if users setup is in progress
 * @param state
 */
export const getSetupInProgressMap = state => state.users.setupInProgress;

/**
 * Gets users map from state
 * @type {Reselect.Selector}
 */
export const getUsersMap = createSelector([
    state => state.users.list,
    (_, { params }) => params.id,
], (users, serverId) => users.get(serverId));

/**
 * Gets users array from users' map
 * @type {Reselect.Selector<Immutable.Map, object[]>}
 */
export const getUsersArray = createSelector([
    getUsersMap,
], (map) => {
    if (Map.isMap(map)) {
        return map.toArray();
    }

    return [];
});

/**
 * Gets single user from users' map
 * @type {Reselect.Selector<Immutable.Map, object>}
 */
export const getUser = createSelector([
    getUsersMap,
    (_, { params }) => params.user_id,
], (map, userId) => map.get(userId));
