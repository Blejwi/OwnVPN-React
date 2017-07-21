import React from 'react';
import { connect } from 'react-redux';
import { edit, preview } from '../../actions/servers';
import { getServer, getFormSelector, getPreview } from '../../selectors/servers';
import ServerForm from '../../components/servers/ServerForm';
import { validateServer } from '../../utils/validators';

/**
 * Container class for editing server
 */
class ServerEdit extends React.Component {
    onPreview() {
        this.props.handlePreview(this.props.config);
    }

    render() {
        return <ServerForm {...this.props} onPreview={() => this.onPreview()} />;
    }
}

const mapStateToProps = (state, ownProps) => ({
    initialValues: getServer(state, ownProps),
    serverMode: getFormSelector(state, 'config.server_mode'),
    devMode: getFormSelector(state, 'config.dev'),
    allowSubnet: getFormSelector(state, 'config.allow_subnet'),
    assignIp: getFormSelector(state, 'config.assign_ip'),
    redirectGateway: getFormSelector(state, 'config.redirect_gateway'),
    config: getPreview(state),
});

const mapDispatchToProps = dispatch => ({
    onSubmit: (server) => {
        validateServer(server);
        dispatch(edit(server));
    },
    handlePreview: (config) => {
        dispatch(preview(config));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerEdit);
