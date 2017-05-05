import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHeaderCell } from 'semantic-ui-react';
import { map } from 'lodash';
import UserListItem from './UserListItem';
import './UserList.scss';

export default (props) => {
    const {
        users,
        server,
        handleSetupClient,
        handleRemoveClient,
        handleDownloadConfiguration,
        setupInProgress,
        userSetupInProgress,
    } = props;

    return (
      <Table singleLine columns={3}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>No.</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>IP address</TableHeaderCell>
            <TableHeaderCell>User setup</TableHeaderCell>
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
                        userSetupInProgress={userSetupInProgress.get(user.id)}
            />
                ))}
        </TableBody>
      </Table>
    );
};
