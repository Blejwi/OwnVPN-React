import React from 'react';
import {isUndefined} from 'lodash';
import {TableRow, TableCell} from 'semantic-ui-react';

export default ({label, value}) => (
    (!isUndefined(value)) ? (
            <TableRow>
                <TableCell>{label}</TableCell>
                <TableCell>{value}</TableCell>
            </TableRow>
        ): null
);
