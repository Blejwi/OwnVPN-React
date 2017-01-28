import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';
import createLogger from 'redux-logger';
import {reducer as form} from 'redux-form';
import 'semantic-ui-css/semantic.min.css';
import auth from './reducers/auth';
import servers from './reducers/servers';
import Dashboard from './containers/dashboard/Dashboard';
import ServerAdd from './containers/servers/ServerAdd';

const combinedReducers = combineReducers({
    auth,
    servers,
    routing,
    form
});
const logger = createLogger();
const store = createStore(combinedReducers, applyMiddleware(logger));
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Dashboard}>
                <Route path="server">
                    <Route path="add" component={ServerAdd}/>
                </Route>
            </Route>
            <Route path="*" component={Dashboard}/>
        </Router>
    </Provider>,
    document.getElementById("main")
);