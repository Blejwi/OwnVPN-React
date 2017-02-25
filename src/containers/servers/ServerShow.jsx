import React from 'react';
import {connect} from 'react-redux';
import {getServer} from '../../selectors/servers';

class ServerShow extends React.Component {
    render() {
        return <span>{this.props.server.name}</span>;
    }
}

const mapStateToProps = (state, ownProp) => ({
    server: getServer(state, ownProp)
});

export default connect(mapStateToProps)(ServerShow);