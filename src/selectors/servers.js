import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { formValueSelector } from 'redux-form';
import os from 'os';
import { DEFAULT_SERVER_STATUS } from '../constants/servers';
import ConfigurationGenerator from '../core/ConfigurationGenerator';

/**
 * Gets servers map from state
 * @param state
 */
export const getServersMap = state => state.servers.list;

/**
 * Gets servers' setup statuses
 * @param state
 */
export const getSetupInProgressMap = state => state.servers.setupInProgress;

/**
 * Gets servers' statuses map from state
 * @param state
 */
export const getServerStatusMap = state => state.servers.status;

/**
 * Gets servers' fetching status map from state
 * @param state
 */
export const getServerFetchStatusMap = state => state.servers.statusFetch;

/**
 * Checks if terminal can be opened
 */
export const canOpenTerminal = () => os.platform() === 'linux';

/**
 * Transforms servers' map to array
 * @type {Reselect.Selector<Immutable.Map, object[]>}
 */
export const getServerArray = createSelector(
    [getServersMap],
    (map) => {
        if (Map.isMap(map)) {
            return map.toArray();
        }

        return [];
    },
);

/**
 * Gets single server object
 * @type {Reselect.Selector<Immutable.Map, object>}
 */
export const getServer = createSelector([
    getServersMap,
    (_, { params }) => params.id,
], (map, id) => map.get(id));

/**
 * Checks if server's setup is in progress
 * @type {Reselect.Selector<Immutable.Map, bool>}
 */
export const getSetupInProgress = createSelector([
    getSetupInProgressMap,
    (_, { params, id }) => String(params ? params.id : id),
], (map, id) => map.get(id, false));

/**
 * Gets server's status
 * @type {Reselect.Selector<Immutable.Map, object>}
 */
export const getServerStatus = createSelector([
    getServerStatusMap,
    (_, { server }) => String(server.id),
], (map, id) => map.get(id, DEFAULT_SERVER_STATUS));

/**
 * Gets server's status fetch is pending
 * @type {Reselect.Selector<Immutable.Map, bool>}
 */
export const getServerFetchStatus = createSelector([
    getServerFetchStatusMap,
    (_, { server }) => String(server.id),
], (map, id) => map.get(id, false));

/**
 * Gets server's form selector
 */
export const getFormSelector = formValueSelector('server');

/**
 * Gets server's configuration preview
 * @type {Reselect.Selector<object, string>}
 */
export const getPreview = createSelector([
    state => getFormSelector(state, 'config'),
], config => ConfigurationGenerator.generate(config));
