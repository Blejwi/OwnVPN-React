import React from "react";
import {TableRow, TableCell, Button} from "semantic-ui-react";
import Spinner from 'react-spinkit';

export default ({user, server, index, handleSetupClient, setupInProgress}) => (
    <TableRow>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.ipAddress}</TableCell>
        <TableCell>
            <Button primary disabled={setupInProgress} onClick={() => handleSetupClient(server, user)}>
                { setupInProgress ? <Spinner spinnerName="circle" className="button-spinner" /> : null }
                Setup
            </Button>
        </TableCell>
    </TableRow>
);
