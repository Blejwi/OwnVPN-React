import React from 'react';
import { connect } from 'react-redux';
import ServerForm from '../../components/servers/ServerForm';
import { add, preview } from '../../actions/servers';
import { getFormSelector, getPreview } from '../../selectors/servers';
import { DEFAULT_SERVER_CONFIG } from '../../constants/servers';
import { validateServer } from '../../utils/validators';

/**
 * Container class for adding server
 */
class ServerAdd extends React.Component {

    /**
     * Function used to show OpenVPN configuration preview
     */
    onPreview() {
        this.props.handlePreview(this.props.config);
    }

    render() {
        return <ServerForm {...this.props} onPreview={() => this.onPreview()} />;
    }
}

const mapStateToProps = state => ({
    initialValues: {
        port: 22,
        config: {
            ...DEFAULT_SERVER_CONFIG,
        },
    },
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
        dispatch(add(server));
    },
    handlePreview: config => dispatch(preview(config)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerAdd);
