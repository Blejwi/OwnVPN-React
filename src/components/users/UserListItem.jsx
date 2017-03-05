import React from 'react';
import {TableRow, TableCell} from 'semantic-ui-react';

export default ({user, index}) => (
    <TableRow>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.ipAddress}</TableCell>
    </TableRow>
);