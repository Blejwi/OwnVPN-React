import React from 'react';
import {Card} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {updateStatus} from "../../../actions/servers";
import {getServerStatus, getServerFetchStatus} from "../../../selectors/servers";
import ServerStatusItem from './ServerStatusItem';

class ServerStatus extends React.Component {
    render() {
        return (
            <Card.Group className="server-status">
                <ServerStatusItem
                    name="Server status"
                    statusFetchInProgress={this.props.serverStatusFetchInProgress}
                    handleRefresh={() => this.updateServerStatus()}
                    {...this.props.serverStatus.server}
                />
                <ServerStatusItem
                    name="VPN status"
                    statusFetchInProgress={this.props.serverStatusFetchInProgress}
                    handleRefresh={() => this.updateServerStatus()}
                    {...this.props.serverStatus.vpn}
                />
            </Card.Group>
        );
    }

    updateServerStatus() {
        return this.props.updateStatus(this.props.server);
    }

    componentDidMount() {
        this.props.updateStatus(this.props.server);
        this.intervalId = setInterval(() => this.updateServerStatus(), 60000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
}

const mapStateToProps = (state, ownProps) => ({
    serverStatus: getServerStatus(state, ownProps),
    serverStatusFetchInProgress: getServerFetchStatus(state, ownProps),
});

const mapDispatchToProps = dispatch => ({
    updateStatus: server => dispatch(updateStatus(server))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerStatus);
