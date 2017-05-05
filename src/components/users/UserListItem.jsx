import React from 'react';
import { Link } from 'react-router';
import { TableRow, TableCell, Button, Popup, Icon, Loader } from 'semantic-ui-react';

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
        <TableCell>{index + 1}</TableCell>
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
                          <Link to={`/server/${server.id}/user/edit/${user.id}`}>
                            <Button
                                    icon="write"
                                    disabled={setupInProgress}
                                    loading={setupInProgress}
                            />
                          </Link>
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
            <Popup
                        trigger={(
                          <Button
                                icon="download"
                                onClick={() => handleDownloadConfiguration(server, user)}
                                disabled={setupInProgress}
                                loading={setupInProgress}
                          />
                        )}
                        content={`Download configuration for ${user.name}`}
            />
          </Button.Group>
        </TableCell>
      </TableRow>
    );
};
