import React from 'react';
import {connect} from 'react-redux';
import {edit} from '../../actions/servers';
import {getServer} from '../../selectors/servers';

class ServerEdit extends React.Component {
    render() {
        return <ServerForm {...this.props}/>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    initialValues: getServer(state, ownProps)
});

const mapDispatchToProps = dispatch => ({
    onSubmit: server => dispatch(edit(server.id, server))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerEdit);