import { createSelector } from 'reselect';
import { List } from 'immutable';

/**
 * Gets list of logs from state
 * @param state
 */
export const getLogsList = state => state.logs.list;

/**
 * Transforms logs list to array
 * @type {Reselect.Selector<Immutable.List, object[]>}
 */
export const getLogsArray = createSelector(
    [getLogsList],
    (list) => {
        if (List.isList(list)) {
            return list.toArray().reverse();
        }

        return [];
    },
);

/**
 * Checks is logs list is collapsed
 * @param state
 */
export const getLogsCollapsed = state => state.logs.collapsed;
