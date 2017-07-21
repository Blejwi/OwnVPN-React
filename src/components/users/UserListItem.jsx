import React from 'react';
import { Link } from 'react-router';
import { TableRow, TableCell, Button, Popup, Icon, Loader } from 'semantic-ui-react';

/**
 * User list single item
 * @param {object} props Data and action for component
 * @return {XML} Rendered component
 */
export default (props) => {
    const {
        user,
        server,
        index,
        handleSetupClient,
        handleRemoveClient,
        handleDownloadConfiguration,
        setupInProgress,
        userSetupInProgress,
    } = props;

    return (
      <TableRow>
        <TableCell>
          <Popup hoverable trigger={<span>{index + 1}</span>}>
            <Popup.Content>{`User id: ${user.id}`}</Popup.Content>
          </Popup>
        </TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.ipAddress}</TableCell>
        <TableCell className="loaderContainer">
          {userSetupInProgress ? <span><Loader active size="small" /></span> : user.ranSetup ?
            <Icon name="checkmark" title="User was already setup" /> :
            <Icon name="remove" title="User was not setup yet" />}
        </TableCell>
        <TableCell>
          <Button.Group>
            <Popup
                        trigger={(
                          <Button
                                primary
                                disabled={setupInProgress}
                                loading={setupInProgress}
                                onClick={() => handleSetupClient(server, user)}
                                icon="configure"
                          />
                        )}
                        content={`Setup ${user.name}`}
            />
            <Popup
                        trigger={(
                          <Button
                                as={Link}
                                icon="write"
                                disabled={setupInProgress}
                                loading={setupInProgress}
                                to={`/server/${server.id}/user/edit/${user.id}`}
                          />
                        )}
                        content={`Edit ${user.name}`}
            />
            <Popup
                        trigger={(
                          <Button
                                icon="delete"
                                onClick={() => handleRemoveClient(server, user)}
                                disabled={setupInProgress}
                                loading={setupInProgress}
                          />
                        )}
                        content={`Remove ${user.name}`}
            />
            {user.ranSetup ? <Popup
                        trigger={(
                          <Button
                                icon="download"
                                onClick={() => handleDownloadConfiguration(server, user)}
                                disabled={setupInProgress}
                                loading={setupInProgress}
                          />
                        )}
                        content={`Download configuration for ${user.name}`}
            /> : null}
          </Button.Group>
        </TableCell>
      </TableRow>
    );
};
