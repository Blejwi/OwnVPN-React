import {createStore, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import reducers from '../reducers';

const logger = createLogger();
const store = createStore(reducers, applyMiddleware(logger));

export default store;
export const history = syncHistoryWithStore(browserHistory, store);