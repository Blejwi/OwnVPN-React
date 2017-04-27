import React from 'react';
import { Message } from 'semantic-ui-react';

export default ({ touched, error, disabled }) => (
    (touched && error && !disabled) ? (
      <Message visible error>{error}</Message>
    ) : null
);
