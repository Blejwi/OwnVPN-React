import React from 'react';
import {connect} from 'react-redux';
import ServerList from '../../components/servers/ServerList';
import {getServerArray} from '../../selectors/servers';

class ServerMenu extends React.Component {
    render() {
        return <ServerList servers={this.props.servers} activeMenuItem={this.props.activeMenuItem} />;
    }
}

const mapStateToProps = state => ({
    servers: getServerArray(state),
    activeMenuItem: state.menu.sidebar_active
});

export default connect(mapStateToProps)(ServerMenu);
