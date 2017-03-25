import React from 'react';
import {connect} from 'react-redux';
import {getServer, getSetupInProgress} from '../../selectors/servers';
import {getUsersArray} from '../../selectors/users';
import {setup} from '../../actions/servers';
import ServerShowContent from '../../components/servers/ServerShowContent';
import {setupClient} from "../../actions/users";

class ServerShow extends React.Component {
    render() {
        return <ServerShowContent {...this.props}/>;
    }
}

const mapStateToProps = (state, ownProp) => ({
    server: getServer(state, ownProp),
    users: getUsersArray(state, ownProp),
    setupInProgress: getSetupInProgress(state, ownProp)
});

const mapDispatchToProps = dispatch => ({
    handleSetup: server => dispatch(setup(server)),
    handleSetupClient: (server, user) => dispatch(setupClient(server, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerShow);
