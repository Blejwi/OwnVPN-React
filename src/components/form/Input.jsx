import React from 'react';
import { Form } from 'semantic-ui-react';

import Label from './Label';
import Error from './Error';

/**
 * Displays basic input component
 * @param {object} input Input's attributes
 * @param {string|custom} label Input's label
 * @param {string} helpMessage Message with useful information for user
 * @param {string} type Input's type
 * @param {bool} required Set if input is required
 * @param {bool} readOnly Set if input is read only
 * @param {bool} disabled Set if input is disabled
 * @param {string|custom} action Button displayed beside input
 * @param {string} placeholder Placeholder text
 * @param {bool} touched Set if input is touched
 * @param {string} error Error message
 */
export default ({
                    input,
                    label,
                    helpMessage,
                    type,
                    required,
                    readOnly,
                    disabled,
                    action,
                    placeholder,
                    meta: {
                        touched,
                        error,
                    },
                }) => (
                  <Form.Field>
                    <Form.Input
                        {...input}
                        action={action}
                        readOnly={readOnly}
                        placeholder={placeholder || label}
                        label={<Label helpMessage={helpMessage}>{label}</Label>}
                        type={type}
                        disabled={disabled}
                        required={required}
                    />
                    <Error touched={touched} error={error} disabled={disabled} />
                  </Form.Field>
);
