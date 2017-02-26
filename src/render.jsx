import React from 'react';
import ReduxThunk from 'redux-thunk'
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';
import createLogger from 'redux-logger';
import {reducer as form} from 'redux-form';
import 'semantic-ui-css/semantic.min.css';
import './resource/main.css';
import auth from './reducers/authorization';
import servers from './reducers/servers';
import Dashboard from './containers/dashboard/Dashboard';
import SelectSource from './components/authorization/SelectSource';
import Authorization from './components/authorization/Authorization';
import NewFile from './containers/authorization/NewFile';
import OpenFile from './containers/authorization/OpenFile';
import ServerAdd from './containers/servers/ServerAdd';
import ServerShow from './containers/servers/ServerShow';
import logs from "./reducers/logs";

const combinedReducers = combineReducers({
    auth,
    servers,
    routing,
    form,
    logs
});
const logger = createLogger();
const store = createStore(combinedReducers, applyMiddleware(logger, ReduxThunk));
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Dashboard}>
                <Route path="server">
                    <Route path="add" component={ServerAdd}/>
                    <Route path="show/:id" component={ServerShow}/>
                </Route>
            </Route>
            <Route path="/login" component={Authorization}>
                <IndexRoute component={SelectSource}/>
                <Route path="new" component={NewFile}/>
                <Route path="open" component={OpenFile}/>
            </Route>
            <Route path="*" component={Dashboard}/>
        </Router>
    </Provider>,
    document.getElementById("main")
);