import React from 'react';
import {connect} from 'react-redux';
import {Container, Grid} from 'semantic-ui-react'
import ServerMenu from '../servers/ServerMenu';
import Logs from '../../components/logs/Logs';
import {getLogsArray} from "../../selectors/logs";


class Dashboard extends React.Component {
    render() {
        return (
            <Container fluid>
                <Grid padded={true}>
                    <Grid.Column width="4">
                        <ServerMenu/>
                    </Grid.Column>
                    <Grid.Column width="12">
                        {this.props.children}
                    </Grid.Column>
                    <Grid.Column width="16">
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