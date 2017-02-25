import {createSelector} from 'reselect';
import {Map} from 'immutable';

export const getServersMap = state => state.servers.list;

export const getServerArray = createSelector(
    [getServersMap],
    map => (Map.isMap(map)) ? map.toArray() : []
);

export const getServer = createSelector([
    getServersMap,
    (_, {params}) => params.id
], (map, id) => map.get(id));