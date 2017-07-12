/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

/**
 * Creates Redux's middleware
 * @type {GenericStoreEnhancer}
 */
const middleware = applyMiddleware(thunk, routerMiddleware(browserHistory));

/**
 * Creates Redux's store
 */
const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    middleware,
);

export default store;

/**
 * Synchronizes store with browser history
 */
export const history = syncHistoryWithStore(browserHistory, store);
