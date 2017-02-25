import React from 'react';
import {Link} from 'react-router';
import {Button, Grid, Header} from 'semantic-ui-react';

export default () => (
    <Grid padded='vertically' columns={1}>
        <Grid.Column>
            <Header as="h1">Select source</Header>
            <Link to="/login/new" className="link-block">
                <Button size="big" fluid>New file</Button>
            </Link>
        </Grid.Column>
        <Grid.Column>
            <Link to="/login/open" className="link-block">
                <Button size="big" primary fluid>Open file</Button>
            </Link>
        </Grid.Column>
    </Grid>
);