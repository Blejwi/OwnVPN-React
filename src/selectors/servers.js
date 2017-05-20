import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { formValueSelector } from 'redux-form';
import os from 'os';
import { DEFAULT_SERVER_STATUS } from '../constants/servers';
import ConfigurationGenerator from '../core/ConfigurationGenerator';

export const getServersMap = state => state.servers.list;
export const getSetupInProgressMap = state => state.servers.setupInProgress;
export const getServerStatusMap = state => state.servers.status;
export const getServerFetchStatusMap = state => state.servers.statusFetch;
export const canOpenTerminal = () => os.platform() === 'linux';

export const getServerArray = createSelector(
    [getServersMap],
    (map) => {
        if (Map.isMap(map)) {
            return map.toArray();
        }

        return [];
    },
);

export const getServer = createSelector([
    getServersMap,
    (_, { params }) => params.id,
], (map, id) => map.get(id));

export const getSetupInProgress = createSelector([
    getSetupInProgressMap,
    (_, { params, id }) => String(params ? params.id : id),
], (map, id) => map.get(id, false));

export const getServerStatus = createSelector([
    getServerStatusMap,
    (_, { server }) => String(server.id),
], (map, id) => map.get(id, DEFAULT_SERVER_STATUS));

export const getServerFetchStatus = createSelector([
    getServerFetchStatusMap,
    (_, { server }) => String(server.id),
], (map, id) => map.get(id, false));

export const getFormSelector = formValueSelector('server');

export const getPreview = createSelector([
    state => getFormSelector(state, 'config'),
], config => ConfigurationGenerator.generate(config));
