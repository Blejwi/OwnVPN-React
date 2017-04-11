import {createStore, applyMiddleware} from 'redux';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk'
import reducers from '../reducers';

const middleware = applyMiddleware(thunk, routerMiddleware(browserHistory));

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    middleware
);

export default store;
export const history = syncHistoryWithStore(browserHistory, store);
