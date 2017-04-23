import React from 'react';
import {connect} from 'react-redux';
import {edit, preview} from '../../actions/servers';
import {getServer, getFormSelector} from '../../selectors/servers';
import ServerForm from '../../components/servers/ServerForm';

class ServerEdit extends React.Component {
    onPreview() {
        this.props.handlePreview(this.props.config);
    }

    render() {
        return <ServerForm {...this.props}/>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    initialValues: getServer(state, ownProps),
    serverMode: getFormSelector(state, 'config.server_mode'),
    devMode: getFormSelector(state, 'config.dev'),
    allowSubnet: getFormSelector(state, 'config.allow_subnet'),
    assignIp: getFormSelector(state, 'config.assign_ip'),
    redirectGateway: getFormSelector(state, 'config.redirect_gateway'),
    config: getFormSelector(state, 'config')
});

const mapDispatchToProps = dispatch => ({
    onSubmit: server => {
        dispatch(edit(server));
    },
    handlePreview: config => {
        dispatch(preview(config));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerEdit);
