import React from 'react';
import {connect} from 'react-redux';
import {Container, Grid, Menu} from 'semantic-ui-react'
import ServerMenu from '../servers/ServerMenu';
import Logs from '../../components/logs/Logs';
import {getLogsArray, getLogsCollapsed} from "../../selectors/logs";

import './Dashboard.scss';
import {clear, collapse} from "../../actions/logs";
import {Link} from "react-router";
import {closeFile} from "../../actions/authorization";
import Scroll from "../../components/utils/Scroll";

class Dashboard extends React.Component {
    render() {
        return (
            <Container fluid className={"main " + (this.props.logs_collapsed ? '' : 'bottom-pad')}>
                <Menu attached="top" inverted className="top-menu fixed">
                    <Menu.Item header as={Link} to="/">OwnVPN</Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item onClick={() => this.props.handleLogout()}>Log out</Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Grid padded={true} divided={true}>
                    <Grid.Column width="3" className="sidebar-menu">
                        <Scroll><ServerMenu/></Scroll>
                    </Grid.Column>
                    <Grid.Column width="13" className="main-content">
                        <Scroll><div>{this.props.children}</div></Scroll>
                    </Grid.Column>
                </Grid>

                <div className="logs">
                    <Logs
                        logs={this.props.logs}
                        collapsed={this.props.logs_collapsed}
                        handleCollapse={this.props.handleCollapse}
                        handleClear={this.props.handleClear}
                    />
                </div>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    logs: getLogsArray(state),
    logs_collapsed: getLogsCollapsed(state)
});

const mapDispatchToProps = dispatch => ({
    handleCollapse: server => dispatch(collapse()),
    handleClear: server => dispatch(clear()),
    handleLogout: server => dispatch(closeFile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
