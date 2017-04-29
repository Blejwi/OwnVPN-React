import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid, Menu } from 'semantic-ui-react';
import { Link } from 'react-router';
import ServerMenu from '../servers/ServerMenu';
import Logs from '../../components/logs/Logs';
import { getLogsArray, getLogsCollapsed } from '../../selectors/logs';

import './Dashboard.scss';
import { clear, collapse } from '../../actions/logs';
import { closeFile } from '../../actions/authorization';

// noinspection HtmlDeprecatedTag
const Dashboard = props => (
  <Container fluid className="main">
    <Menu attached="top" inverted className="top-menu fixed">
      <Menu.Item header as={Link} to="/">OwnVPN</Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item onClick={() => props.handleLogout()}>Log out</Menu.Item>
      </Menu.Menu>
    </Menu>
    <Grid padded divided>
      <Grid.Column width="3" className="sidebar-menu">
        <ServerMenu />
      </Grid.Column>
      <Grid.Column width="13" className={`main-content ${props.logsCollapsed ? '' : 'logs-expanded'}`}>
        <div>
          {props.children}
        </div>
      </Grid.Column>
    </Grid>

    <div className="logs">
      <Logs
          logs={props.logs}
          collapsed={props.logsCollapsed}
          handleCollapse={props.handleCollapse}
          handleClear={props.handleClear}
      />
    </div>
  </Container>
);

const mapStateToProps = state => ({
    logs: getLogsArray(state),
    logsCollapsed: getLogsCollapsed(state),
});

const mapDispatchToProps = dispatch => ({
    handleCollapse: () => dispatch(collapse()),
    handleClear: () => dispatch(clear()),
    handleLogout: () => dispatch(closeFile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
