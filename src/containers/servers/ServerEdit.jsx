import React from 'react';
import {connect} from 'react-redux';
import {edit} from '../../actions/servers';
import {getServer} from '../../selectors/servers';
import ServerForm from '../../components/servers/ServerForm';

class ServerEdit extends React.Component {
    render() {
        return <ServerForm {...this.props}/>;
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
        }
    }
});

const mapDispatchToProps = dispatch => ({
    onSubmit: server => dispatch(edit(server))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerEdit);
