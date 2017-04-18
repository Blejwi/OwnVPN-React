import React from 'react';
import {Card} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {updateStatus} from "../../../actions/servers";
import {getServerStatus, getServerFetchStatus} from "../../../selectors/servers";
import ServerStatusItem from './ServerStatusItem';
import {UPDATE_SERVER_STATUS_CACHE_TIME} from "../../../constants/servers";

class ServerStatus extends React.Component {
    constructor() {
        super();
        this.intervalId = null;
    }

    render() {
        return (
            <Card.Group className="server-status" itemsPerRow="3">
                <ServerStatusItem
                    name="Server status"
                    statusFetchInProgress={this.props.serverStatusFetchInProgress}
                    handleRefresh={() => this.updateServerStatus()}
                    updated={this.props.serverStatus.updated}
                    {...this.props.serverStatus.server}
                />
                <ServerStatusItem
                    name="VPN status"
                    statusFetchInProgress={this.props.serverStatusFetchInProgress}
                    handleRefresh={() => this.updateServerStatus()}
                    updated={this.props.serverStatus.updated}
                    {...this.props.serverStatus.vpn}
                />
                <ServerStatusItem
                    name="VPN statistics"
                    statusFetchInProgress={this.props.serverStatusFetchInProgress}
                    handleRefresh={() => this.updateServerStatus()}
                    updated={this.props.serverStatus.updated}
                    {...this.props.serverStatus.users}
                />
            </Card.Group>
        );
    }

    updateServerStatus() {
        return this.props.updateStatus(this.props.server);
    }

    componentWillUpdate(newParams) {
        this._updateTimer(newParams);
    }

    componentWillMount() {
        this._updateTimer(this.props, true);
    }

    _updateTimer(props, force=false) {
        if (force || props.server !== this.props.server) {
            // Update server status only if there is no data fetched, or last fetch is older than declared time
            if (!props.serverStatus.updated || (+new Date()) - props.serverStatus.updated > UPDATE_SERVER_STATUS_CACHE_TIME) {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                }
                this.props.updateStatus(props.server);
                this.intervalId = setInterval(() => this.updateServerStatus(), UPDATE_SERVER_STATUS_CACHE_TIME);
            }
        }
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
