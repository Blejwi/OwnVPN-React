import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const getFileMap = state => state.auth.file;
const isFile = property => (file) => {
    if (Map.isMap(file)) {
        return file.get(property, false);
    }

    return false;
};

export const isFileOpen = createSelector([
    getFileMap,
], isFile('open'));

export const getRecentFiles = createSelector([
    state => state.auth.recentFiles,
], recentFiles => recentFiles.toJS());
