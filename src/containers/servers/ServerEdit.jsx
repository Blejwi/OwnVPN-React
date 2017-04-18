import React from 'react';
import {connect} from 'react-redux';
import {edit} from '../../actions/servers';
import {getServer, getFormSelector} from '../../selectors/servers';
import ServerForm from '../../components/servers/ServerForm';

class ServerEdit extends React.Component {
    render() {
        return <ServerForm {...this.props}/>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    initialValues: getServer(state, ownProps),
    serverMode: getFormSelector(state, 'server_mode')
});

const mapDispatchToProps = dispatch => ({
    onSubmit: server => {
        dispatch(edit(server));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerEdit);
