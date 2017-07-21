import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHeaderCell, Button } from 'semantic-ui-react';
import { map } from 'lodash';
import UserListItem from './UserListItem';
import './UserList.scss';

/**
 * List of users
 * @param props Data and actions for component
 * @returns {XML} Rendered component
 */
export default (props) => {
    const {
        users,
        server,
        handleSetupClient,
        handleSetupAllClients,
        handleRemoveClient,
        handleDownloadConfiguration,
        setupInProgress,
        userSetupInProgress,
    } = props;

    return (
      <div>
        <Button
            primary
            disabled={setupInProgress}
            onClick={() => handleSetupAllClients(server, users)}
            loading={setupInProgress}
        >
              Setup all users
        </Button>
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
      </div>
    );
};
