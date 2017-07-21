import React from 'react';
import { Message } from 'semantic-ui-react';

/**
 * Displays error in Message component
 * @param {bool} touched Set if corresponding input was touched
 * @param {string} error Message to display on error
 * @param {bool} disabled Set if corresponding input is disabled
 */
export default ({ touched, error, disabled }) => (
    (touched && error && !disabled) ? (
      <Message visible error>{error}</Message>
    ) : null
);
