import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHeaderCell } from 'semantic-ui-react';
import { map } from 'lodash';
import UserListItem from './UserListItem';

export default (props) => {
    const {
        users,
        server,
        handleSetupClient,
        handleRemoveClient,
        handleDownloadConfiguration,
        setupInProgress,
    } = props;

    return (
      <Table singleLine columns={3}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>No.</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>IP address</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {map(users, (user, index) => (
            <UserListItem
                        user={user}
                        server={server}
                        index={index}
                        key={index}
                        handleSetupClient={handleSetupClient}
                        handleRemoveClient={handleRemoveClient}
                        handleDownloadConfiguration={handleDownloadConfiguration}
                        setupInProgress={setupInProgress}
            />
                ))}
        </TableBody>
      </Table>
    );
};
