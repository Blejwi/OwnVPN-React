import React from 'react';
import { connect } from 'react-redux';
import { canOpenTerminal, getServer, getSetupInProgress } from '../../selectors/servers';
import { getSetupInProgressMap, getUsersArray } from '../../selectors/users';
import { handleSSHTerminal, setup } from '../../actions/servers';
import ServerShowContent from '../../components/servers/ServerShowContent';
import { setupClient, remove, downloadConfiguration, setupAllClients } from '../../actions/users';

const ServerShow = props => (
  <ServerShowContent {...props} />
);

const mapStateToProps = (state, ownProp) => ({
    server: getServer(state, ownProp),
    users: getUsersArray(state, ownProp),
    setupInProgress: getSetupInProgress(state, ownProp),
    userSetupInProgress: getSetupInProgressMap(state),
    canOpenTerminal: canOpenTerminal(),
});

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = dispatch => ({
    handleSetup: server => dispatch(setup(server)),
    handleSetupClient: (server, user) => dispatch(setupClient(server, user)),
    handleSetupAllClients: (server, users) => dispatch(setupAllClients(server, users)),
    handleRemoveClient: (server, user) => dispatch(remove(server, user)),
    handleDownloadConfiguration: (server, user) => dispatch(downloadConfiguration(server, user)),
    handleSSHTerminal: server => dispatch(handleSSHTerminal(server)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerShow);
