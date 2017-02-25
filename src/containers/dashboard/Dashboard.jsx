import React from 'react';
import {connect} from 'react-redux';
import {Container, Grid} from 'semantic-ui-react'
import ServerMenu from '../servers/ServerMenu';


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
                </Grid>
            </Container>
        )
    }
}

export default connect()(Dashboard);