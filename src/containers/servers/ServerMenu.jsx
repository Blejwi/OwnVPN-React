import React from 'react';
import {connect} from 'react-redux';
import ServerList from '../../components/servers/ServerList';

class ServerMenu extends React.Component {
    render() {
        return (
            <ServerList servers={this.props.servers} />
        )
    }
}

const mapStateToProps = state => ({
    servers: state.servers.list
});

export default connect(mapStateToProps)(ServerMenu);