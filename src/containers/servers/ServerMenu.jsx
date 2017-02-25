import React from 'react';
import {connect} from 'react-redux';
import {Header} from 'semantic-ui-react';
import ServerList from '../../components/servers/ServerList';
import {getServerArray} from '../../selectors/servers';

class ServerMenu extends React.Component {
    render() {
        return (
            <div>
                <Header as="h1">Servers</Header>
                <ServerList servers={this.props.servers} />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    servers: getServerArray(state)
});

export default connect(mapStateToProps)(ServerMenu);