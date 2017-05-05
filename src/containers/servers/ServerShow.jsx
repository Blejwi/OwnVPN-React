import React from 'react';
import { connect } from 'react-redux';
import { getServer, getSetupInProgress } from '../../selectors/servers';
import { getSetupInProgressMap, getUsersArray } from '../../selectors/users';
import { setup } from '../../actions/servers';
import ServerShowContent from '../../components/servers/ServerShowContent';
import { setupClient, remove, downloadConfiguration } from '../../actions/users';

const ServerShow = props => (
  <ServerShowContent {...props} />
);

const mapStateToProps = (state, ownProp) => ({
    server: getServer(state, ownProp),
    users: getUsersArray(state, ownProp),
    setupInProgress: getSetupInProgress(state, ownProp),
    userSetupInProgress: getSetupInProgressMap(state),
});

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = dispatch => ({
    handleSetup: server => dispatch(setup(server)),
    handleSetupClient: (server, user) => dispatch(setupClient(server, user)),
    handleRemoveClient: (server, user) => dispatch(remove(server, user)),
    handleDownloadConfiguration: (server, user) => dispatch(downloadConfiguration(server, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerShow);
