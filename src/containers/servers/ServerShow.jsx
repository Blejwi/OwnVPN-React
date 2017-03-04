import React from 'react';
import {Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {getServer, getSetupInProgress} from '../../selectors/servers';
import {setup} from "../../actions/servers";

class ServerShow extends React.Component {
    render() {
        const {server, handleSetup, setupInProgress} = this.props;
        return (
            <div>
                <span>{server.name}</span>
                <br/>
                <Button primary disabled={setupInProgress} onClick={() => handleSetup(server)}>Setup</Button>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProp) => ({
    server: getServer(state, ownProp),
    setupInProgress: getSetupInProgress(state, ownProp)
});

const mapDispatchToProps = dispatch => ({
    handleSetup: (server) => dispatch(setup(server))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerShow);