import React from 'react';
import {Table, TableBody, TableHeader, TableRow, TableHeaderCell} from 'semantic-ui-react';
import {map} from 'lodash';
import UserListItem from './UserListItem';

export default ({users, server, handleSetupClient, setupInProgress}) => (
    <Table singleLine columns={3}>
        <TableHeader>
            <TableRow>
                <TableHeaderCell>No.</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>IP address</TableHeaderCell>
                <TableHeaderCell>Setup</TableHeaderCell>
            </TableRow>
        </TableHeader>
        <TableBody>
            {map(users, (user, index) => <UserListItem user={user} server={server} index={index} key={index} handleSetupClient={handleSetupClient} setupInProgress={setupInProgress}/>)}
        </TableBody>
    </Table>
);
