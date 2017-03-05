import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute} from 'react-router'
import 'semantic-ui-css/semantic.min.css';
import './resource/main.css';
import store, {history} from './store';
import {isFileOpened} from './selectors/authorization';
import Dashboard from './containers/dashboard/Dashboard';
import SelectSource from './components/authorization/SelectSource';
import Authorization from './components/authorization/Authorization';
import NewFile from './containers/authorization/NewFile';
import OpenFile from './containers/authorization/OpenFile';
import ServerAdd from './containers/servers/ServerAdd';
import ServerShow from './containers/servers/ServerShow';
import ServerEdit from './containers/servers/ServerEdit';
import UserAdd from './containers/users/UserAdd';
import UserEdit from './containers/users/UserEdit';

const requireFile = (next, replace) => {
    if (!isFileOpened(store.getState())) {
        replace('/login');
    }
};

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Dashboard} onEnter={requireFile}>
                <Route path="server">
                    <Route path="add" component={ServerAdd}/>
                    <Route path="show/:id" component={ServerShow}/>
                    <Route path="edit/:id" component={ServerEdit}/>
                    <Route path=":id">
                        <Route path="user">
                            <Route path="add" component={UserAdd}/>
                            <Route path="edit/:name" component={UserEdit}/>
                        </Route>
                    </Route>
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