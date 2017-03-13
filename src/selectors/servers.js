import {createSelector} from 'reselect';
import {Map} from 'immutable';

export const getServersMap = state => state.servers.list;
export const getSetupInProgressMap = state => state.servers.setupInProgress;

export const getServerArray = createSelector(
    [getServersMap],
    map => (Map.isMap(map)) ? map.toArray() : []
);

export const getServer = createSelector([
    getServersMap,
    (_, {params}) => params.id
], (map, id) => map.get(id));

export const getSetupInProgress = createSelector([
    getSetupInProgressMap,
    (_, {params}) => String(params.id)
], (map, id) => map.get(id, false));
