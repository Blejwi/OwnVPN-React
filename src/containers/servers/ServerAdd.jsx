import React from 'react';
import {connect} from 'react-redux';
import ServerForm from '../../components/servers/ServerForm';

class ServerAdd extends React.Component {
    render() {
        return <ServerForm />;
    }
}

export default connect()(ServerAdd);