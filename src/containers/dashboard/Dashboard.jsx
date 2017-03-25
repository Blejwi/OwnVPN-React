import React from 'react';
import {connect} from 'react-redux';
import {Container, Grid, Menu} from 'semantic-ui-react'
import ServerMenu from '../servers/ServerMenu';
import Logs from '../../components/logs/Logs';
import {getLogsArray} from "../../selectors/logs";

import './Dashboard.scss';

class Dashboard extends React.Component {
    render() {
        return (
            <Container fluid className="main">
                <Menu attached="top" inverted className="top-menu">
                    <Menu.Item header>OwnVPN</Menu.Item>
                </Menu>
                <Grid padded={true} divided={true}>
                    <Grid.Column width="3" className="sidebar-menu">
                        <ServerMenu/>
                    </Grid.Column>
                    <Grid.Column width="13">
                        {this.props.children}
                    </Grid.Column>
                    <Grid.Column width="16" className="logs">
                        <Logs logs={this.props.logs}/>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    logs: getLogsArray(state)
});

export default connect(mapStateToProps)(Dashboard);
