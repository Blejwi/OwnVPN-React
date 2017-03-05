import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import {reducer as form} from 'redux-form';
import auth from './authorization';
import servers from './servers';
import logs from './logs';
import users from './users';

export default combineReducers({
    auth,
    servers,
    routing,
    form,
    logs,
    users
});