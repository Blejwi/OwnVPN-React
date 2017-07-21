import React from 'react';
import { Form, Checkbox } from 'semantic-ui-react';
import Error from './Error';

/**
 * Function that handles change event
 * @param {function} change Dispatches change action
 */
const handleChange = change => (event, { name, value }) => change(name, value);

/**
 * Displays radio input
 * @param {object} input Input's attributes
 * @param {string|custom} label Input's label
 * @param {bool} required Set if input is required
 * @param {bool} disabled Set if input is disabled
 * @param {string|number|bool} defaultValue Default input value
 * @param {string|number|bool} currentValue Current input value
 * @param {function} change Dispatches change action
 * @param {bool} touched Set if input is touched
 * @param {string} error Error message
 */
export default ({
                    input,
                    label,
                    required,
                    disabled,
                    defaultValue,
                    currentValue,
                    change,
                    meta: {
                        touched,
                        error,
                    },
                }) => (
                  <Form.Field>
                    <Checkbox
                {...input}
                label={{ children: label }}
                radio
                onChange={handleChange(change)}
                required={required}
                checked={currentValue === defaultValue}
                value={defaultValue}
                disabled={disabled}
                    />
                    <Error touched={touched} error={error} disabled={disabled} />
                  </Form.Field>
);
