import React from 'react';
import { Card, Message, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { loadConfigFromServer, reuploadConfig, updateStatus } from '../../../actions/servers';
import { getServerStatus, getServerFetchStatus, getSetupInProgress } from '../../../selectors/servers';
import ServerStatusItem from './ServerStatusItem';
import { UPDATE_SERVER_STATUS_CACHE_TIME } from '../../../constants/servers';

class ServerStatus extends React.Component {
    // Update server status only if there is no data fetched,
    // or last fetch is older than declared time
    static shouldUpdateStatus(props) {
        return (
            !props.serverStatus.updated ||
            (+new Date()) - props.serverStatus.updated > UPDATE_SERVER_STATUS_CACHE_TIME
        );
    }

    constructor() {
        super();
        this.intervalId = null;
    }

    componentWillMount() {
        this.updateTimer(this.props, true);
    }

    componentWillUpdate(newParams) {
        this.updateTimer(newParams);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    updateServerStatus() {
        return this.props.updateStatus(this.props.server);
    }


    updateTimer(props, force = false) {
        if (force || props.server !== this.props.server) {
            if (ServerStatus.shouldUpdateStatus(props)) {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                }
                this.props.updateStatus(props.server);
                this.intervalId = setInterval(
                    () => this.updateServerStatus(),
                    UPDATE_SERVER_STATUS_CACHE_TIME,
                );
            }
        }
    }

    render() {
        const configDifferent = this.props.serverStatus.config && this.props.serverStatus.config.different;
        return (
          <div className="server-status">
            <Card.Group itemsPerRow="3">
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
            {configDifferent === true ? <Message warning>
              <Message.Header>Config difference</Message.Header>
              <Message.Content>
                <div>
                    There is config difference between saved config and config file on server.
                </div>
                <div className="action-buttons">
                  <Button
                      disabled={this.props.setupInProgress}
                      onClick={() => this.props.handleLoadConfigFromServer(this.props.server)}
                  >
                      Load config from server
                  </Button>
                  <Button
                      disabled={this.props.setupInProgress}
                      onClick={() => this.props.handleReuploadConfig(this.props.server)}
                  >
                      Upload config to server
                  </Button>
                </div>
              </Message.Content>
            </Message> : null}
          </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    serverStatus: getServerStatus(state, ownProps),
    serverStatusFetchInProgress: getServerFetchStatus(state, ownProps),
    setupInProgress: getSetupInProgress(state, ownProps.server),
});

const mapDispatchToProps = dispatch => ({
    updateStatus: server => dispatch(updateStatus(server)),
    handleLoadConfigFromServer: server => dispatch(loadConfigFromServer(server, () => dispatch(updateStatus(server)))),
    handleReuploadConfig: server => dispatch(reuploadConfig(server, () => dispatch(updateStatus(server)))),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerStatus);
