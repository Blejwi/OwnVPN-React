import {createSelector} from 'reselect';
import {List} from 'immutable';

export const getLogsList = state => state.logs.list;

export const getLogsArray = createSelector(
    [getLogsList],
    list => (List.isList(list)) ? list.toArray().reverse() : []
);
