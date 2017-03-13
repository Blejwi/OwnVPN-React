import React from 'react';
import {Button, Header, Table, TableBody, TableRow, TableCell} from 'semantic-ui-react';
import {Link} from 'react-router';
import UserList from '../users/UserList';
import Spinner from 'react-spinkit';

export default ({server, setupInProgress, handleSetup, handleSetupClient, users}) => (
    <div>
        <Header as="h1">Server information</Header>
        <Table definition>
            <TableBody>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{server.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Host</TableCell>
                    <TableCell>{server.host}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Port</TableCell>
                    <TableCell>{server.port}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <Header as="h1">Users</Header>
        <UserList users={users} server={server} handleSetupClient={handleSetupClient} setupInProgress={setupInProgress}/>
        <Link to={`/server/edit/${server.id}`}><Button>Edit</Button></Link>
        <Button primary disabled={setupInProgress} onClick={() => handleSetup(server)}>
            { setupInProgress ? <Spinner spinnerName="circle" className="button-spinner" /> : null }
            Setup
        </Button>
    </div>
);
