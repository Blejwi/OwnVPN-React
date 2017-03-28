import React from 'react';
import {connect} from 'react-redux';
import ServerForm from '../../components/servers/ServerForm';
import {add} from '../../actions/servers';

class ServerAdd extends React.Component {
    render() {
        return <ServerForm onSubmit={this.props.onSubmit} {...this.props} />;
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
            auth_algorithm: 'BF-CBC',
            cipher_algorithm: 'SHA256',
            ccd: true,
        }
    }
});

const mapDispatchToProps = dispatch => ({
    onSubmit: server => dispatch(add(server))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerAdd);
