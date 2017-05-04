import React from 'react';
import { connect } from 'react-redux';
import ServerForm from '../../components/servers/ServerForm';
import { add, preview } from '../../actions/servers';
import { getPreview } from '../../selectors/servers';
import { DEFAULT_SERVER_CONFIG } from '../../constants/servers';
import { validateServer } from '../../utils/validators';

class ServerAdd extends React.Component {
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
