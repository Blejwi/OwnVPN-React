import {createSelector} from 'reselect';
import {Map} from 'immutable';
import {STATUS} from "../constants/servers";

export const getServersMap = state => state.servers.list;
export const getSetupInProgressMap = state => state.servers.setupInProgress;
export const getServerStatusMap = state => state.servers.status;
export const getServerFetchStatusMap = state => state.servers.statusFetch;

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

export const getServerStatus = createSelector([
    getServerStatusMap,
    (_, {server}) => String(server.id)
], (map, id) => map.get(id, {
    server: {
        level: STATUS.UNKNOWN,
        description: null
    },
    vpn: {
        level: STATUS.UNKNOWN,
        description: null
    }
}));

export const getServerFetchStatus = createSelector([
    getServerFetchStatusMap,
    (_, {server}) => String(server.id)
], (map, id) => map.get(id, false));
