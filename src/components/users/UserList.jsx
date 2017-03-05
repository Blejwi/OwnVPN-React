import React from 'react';
import {Table, TableBody, TableHeader, TableRow, TableHeaderCell} from 'semantic-ui-react';
import {map} from 'lodash';
import UserListItem from './UserListItem';

export default ({users}) => (
    <Table singleLine columns={3}>
        <TableHeader>
            <TableRow>
                <TableHeaderCell>No.</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>IP address</TableHeaderCell>
            </TableRow>
        </TableHeader>
        <TableBody>
            {map(users, (user, index) => <UserListItem user={user} index={index} key={index}/>)}
        </TableBody>
    </Table>
);