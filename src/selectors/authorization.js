import { createSelector } from 'reselect';
import { Map } from 'immutable';

/**
 * Returns file from state
 * @param state
 */
export const getFileMap = state => state.auth.file;

/**
 * Returns property from file's map
 * @param {string} property File's property
 */
const isFile = property => (file) => {
    if (Map.isMap(file)) {
        return file.get(property, false);
    }

    return false;
};

/**
 * Checks if file is open
 * @type {Reselect.Selector}
 */
export const isFileOpen = createSelector([
    getFileMap,
], isFile('open'));

/**
 * Gets recently opened files
 * @type {Reselect.Selector}
 */
export const getRecentFiles = createSelector([
    state => state.auth.recentFiles,
], recentFiles => recentFiles.toJS());
