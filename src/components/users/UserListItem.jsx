import React from "react";
import {Link} from 'react-router';
import {TableRow, TableCell, Button, Popup} from "semantic-ui-react";

export default ({user, server, index, handleSetupClient, handleRemoveClient, handleDownloadOvpnFile, setupInProgress}) => (
    <TableRow>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.ipAddress}</TableCell>
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
                        <Link to={`/server/${server.id}/user/edit/${user.name}`}>
                            <Button
                                icon="write"
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
                        />
                    )}
                    content={`Remove ${user.name}`}
                />
                <Popup
                    trigger={(
                        <Button
                            icon="download"
                            onClick={() => handleDownloadOvpnFile(server, user)}
                            disabled={setupInProgress}
                            loading={setupInProgress}
                        />
                    )}
                    content={`Download ovpn file for ${user.name}`}
                />
            </Button.Group>
        </TableCell>
    </TableRow>
);
