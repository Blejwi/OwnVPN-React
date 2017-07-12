import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import ReduxToastr from 'react-redux-toastr';
import ReduxSweetAlert from 'react-redux-sweetalert';
import store, { history } from './../store';
import Dashboard from './../containers/dashboard/Dashboard';
import SelectSource from './authorization/Login';
import Authorization from './../components/authorization/Authorization';
import NewFile from './../containers/authorization/NewFile';
import ServerAdd from './../containers/servers/ServerAdd';
import ServerShow from './../containers/servers/ServerShow';
import ServerEdit from './../containers/servers/ServerEdit';
import UserAdd from './../containers/users/UserAdd';
import UserEdit from './../containers/users/UserEdit';
import Home from './../containers/home/Home';
import { isFileOpen } from './../selectors/authorization';

/**
 * Validation function. Required from user to have opened configuration file.
 * Otherwise redirects user to login page.
 * @param {RouterState} next next state
 * @param {RedirectFunction} replace redirect function
 */
const requireFile = (next, replace) => {
    if (!isFileOpen(store.getState())) {
        replace('/login');
    }
};

/**
 * Main application container.
 * Includes state provider, SweetAlert, Toastr and routing
 */
export default () => (
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/" component={Dashboard} onEnter={requireFile}>
          <Route path="server">
            <Route path="add" component={ServerAdd} />
            <Route path="show/:id" component={ServerShow} />
            <Route path="edit/:id" component={ServerEdit} />
            <Route path=":id">
              <Route path="user">
                <Route path="add" component={UserAdd} />
                <Route path="edit/:user_id" component={UserEdit} />
              </Route>
            </Route>
          </Route>
          <IndexRoute component={Home} />
        </Route>
        <Route path="/login" component={Authorization}>
          <IndexRoute component={SelectSource} />
          <Route path="new" component={NewFile} />
        </Route>
        <Route path="*" component={Dashboard} />
      </Router>
      <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
      />
      <ReduxSweetAlert />
    </div>
  </Provider>
);
