import {createStore, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk'
import reducers from '../reducers';

const logger = createLogger();
const middleware = applyMiddleware(logger, thunk, routerMiddleware(browserHistory));
const store = createStore(reducers, middleware);

export default store;
export const history = syncHistoryWithStore(browserHistory, store);