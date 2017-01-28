import React from 'react';
import {connect} from 'react-redux';
import ServerForm from '../../components/servers/ServerForm';
import {add} from '../../actions/servers';

class ServerAdd extends React.Component {
    render() {
        return <ServerForm onSubmit={this.props.onSubmit} />;
    }
}

const mapDispatchToProps = dispatch => ({
    onSubmit: server => dispatch(add(server))
});

export default connect(null, mapDispatchToProps)(ServerAdd);