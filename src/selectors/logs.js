import { createSelector } from 'reselect';
import { List } from 'immutable';

export const getLogsList = state => state.logs.list;

export const getLogsArray = createSelector(
    [getLogsList],
    (list) => {
        if (List.isList(list)) {
            return list.toArray().reverse();
        }

        return [];
    },
);

export const getLogsCollapsed = state => state.logs.collapsed;
