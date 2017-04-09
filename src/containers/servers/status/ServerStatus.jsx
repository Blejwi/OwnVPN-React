import React from 'react';
import {Card} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {updateStatus} from "../../../actions/servers";
import {getServerStatus} from "../../../selectors/servers";
import ServerStatusItem from './ServerStatusItem';

class ServerStatus extends React.Component {
    render() {
        return (
            <Card.Group className="server-status">
                <ServerStatusItem name="Server status" {...this.props.serverStatus.server}/>
                <ServerStatusItem name="VPN status"  {...this.props.serverStatus.vpn}/>
            </Card.Group>
        );
    }

    componentDidMount() {
        this.props.updateStatus(this.props.server);
        this.intervalId = setInterval(() => this.props.updateStatus(this.props.server), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
}

const mapStateToProps = (state, ownProps) => ({
    serverStatus: getServerStatus(state, ownProps),
});

const mapDispatchToProps = dispatch => ({
    updateStatus: server => dispatch(updateStatus(server))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerStatus);
