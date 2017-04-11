import {createSelector} from 'reselect';
import {Map} from 'immutable';

export const getFileMap = state => state.auth.file;
export const getRecentFiles = state => state.auth.recentFiles.toJS();
const isFile = property => file => Map.isMap(file) ? file.get(property, false) : false;

export const isFileDecrypted = createSelector([
    getFileMap
], isFile('decrypted'));

export const isFileDirty = createSelector([
    getFileMap
], isFile('dirty'));

export const isFileOpen = createSelector([
    getFileMap
], isFile('open'));
