import React from 'react';
import {Message} from 'semantic-ui-react';

export default ({touched, error}) => (
    (touched && error) ? (
        <Message visible error>{error}</Message>
    ) : null
);
