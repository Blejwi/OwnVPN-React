import React from 'react';
import {connect} from 'react-redux';
import ServerForm from '../../components/servers/ServerForm';
import {add, preview} from '../../actions/servers';
import {getPreview} from '../../selectors/servers';

class ServerAdd extends React.Component {
    onPreview() {
        this.props.handlePreview(this.props.config);
    }

    render() {
        return <ServerForm {...this.props} onPreview={() => this.onPreview()} />;
    }
}

const mapStateToProps = (state, ownProps) => ({
    initialValues: {
        config: {
            port: '1194',
            protocol: 'udp',
            dev: 'tun',
            tls_auth: true,
            user_privilege: 'nobody',
            group_privilege: 'nogroup',
            max_clients: '',
            auth_algorithm: 'SHA256',
            cipher_algorithm: 'BF-CBC',
        }
    },
    config: getPreview(state)
});

const mapDispatchToProps = dispatch => ({
    onSubmit: server => dispatch(add(server)),
    handlePreview: config => dispatch(preview(config))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerAdd);
