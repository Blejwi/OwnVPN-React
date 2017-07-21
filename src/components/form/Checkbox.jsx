import React from 'react';
import { Form, Checkbox } from 'semantic-ui-react';
import Error from './Error';

/**
 * Function that handles change event
 * @param {function} change Dispatches change action
 */
const handleChange = change => (event, { name, checked }) => change(name, checked);

/**
 * Displays checkbox input
 * @param {object} input Input specific attributes
 * @param {string|custom} label Label for checkbox
 * @param {bool} required Set if input is required
 * @param {function} change Dispatches change action
 * @param {bool} touched Set if input was touched
 * @param {string} error Set if input is invalid
 */
export default ({ input, label, required, change, meta: { touched, error } }) => (
  <Form.Field>
    <Checkbox
            {...input}
            label={{ children: label }}
            required={required}
            onChange={handleChange(change)}
    />
    <Error touched={touched} error={error} />
  </Form.Field>
);
