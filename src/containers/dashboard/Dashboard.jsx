import React from 'react';
import {connect} from 'react-redux';
import { Container, Grid } from 'semantic-ui-react'
import ServerAdd from '../servers/ServerAdd';
import ServerMenu from '../servers/ServerMenu';


class Dashboard extends React.Component {
    render() {
        return (
            <Container>
                <Grid>
                    <Grid.Column width="4">
                        <ServerMenu/>
                    </Grid.Column>
                    <Grid.Column width="12">
                        <ServerAdd/>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

export default connect()(Dashboard);