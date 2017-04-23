import React from 'react';
import {isUndefined} from 'lodash';
import {TableRow, TableCell} from 'semantic-ui-react';

export default ({label, value}) => (
    (!isUndefined(value) && value !== '') ? (
            <TableRow>
                <TableCell>{label}</TableCell>
                <TableCell positive={value === 'Yes'} negative={value === 'No'}>{value}</TableCell>
            </TableRow>
        ): null
);
