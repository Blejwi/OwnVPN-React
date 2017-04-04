import * as USER from "../constants/users";
import SSH from "../core/SSH";
import {toastr} from "react-redux-toastr";
import {add as addLog} from "../actions/logs";
import {save} from "./authorization";
import * as LOG from "../constants/logs";

export const add = user => dispatch => {
    dispatch({
        type: USER.ADD,
        payload: user
    });
    dispatch(save());
};

export const edit = user => dispatch => {
    dispatch({
        type: USER.EDIT,
        payload: user
    });
    dispatch(save());
};

export const remove = (server, user) => ({
    type: USER.REMOVE,
    payload: {
        serverId: server.id,
        userName: user.name
    }
});

export const download = user => ({
    type: USER.DOWNLOAD,
    payload: user
});

const setupSuccess = (user) =>  ({
    type: USER.SETUP_SUCCESS,
    payload: {
        user
    }
});

const setupFailure = (user) =>  ({
    type: USER.SETUP_FAILURE,
    payload: {
        user
    }
});

export const setupClient = (server, user) => dispatch => {
    dispatch({type: USER.SETUP, payload: {server, user}});
    let ssh = new SSH(dispatch, server);

    ssh.setup_client(user)
        .then(() => {
            dispatch(addLog(`Client setup success`, LOG.LEVEL.INFO, 'USER'));
            return dispatch(setupSuccess(server));
        })
        .catch(() => {
            dispatch(addLog(`Client setup failure`, LOG.LEVEL.ERROR, 'USER'));
            return dispatch(setupFailure(server));
        });
};

export const downloadOvpnFile = (server, user) => dispatch => {
    let ssh = new SSH(dispatch, server);
    ssh.download_ovpn_file(user).then(() => {
        toastr.success('Download', `Successfully downloaded ovpn file`);
    }).catch(e => {
        toastr.error('Download', `There was a problem during file download: ${e}`);
    });
};

export const fetch = (servers) => ({
    type: USER.FETCH,
    payload: servers
});
