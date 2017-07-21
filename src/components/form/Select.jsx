import React from 'react';
import { Form } from 'semantic-ui-react';
import { map } from 'lodash';
import Label from './Label';
import Error from './Error';

/**
 * Displays select input
 * @param {object} input Input's attributes
 * @param {string|custom} label Input's label
 * @param {{text: string, value: string|number|bool}[]}options Select optins
 * @param {string} helpMessage Message with useful information for user
 * @param {bool} required Set if input is required
 * @param {bool} disabled Set if input is disabled
 * @param {bool} touched Set if input is touched
 * @param {string} error Error message
 */
export default ({
                     input,
                     label,
                     options,
                     helpMessage,
                     required,
                     disabled,
                     meta: {
                         touched,
                         error,
                     },
                 }) => (
                   <Form.Field className={required ? 'required' : ''}>
                     <Label helpMessage={helpMessage}>{label}</Label>
                     <select {...input} placeholder={label} required={required} disabled={disabled}>
                       {map(options, (option, key) => (
                         <option key={key} value={option.value}>
                           {option.text}
                         </option>
                        ))}
                     </select>
                     <Error touched={touched} error={error} disabled={disabled} />
                   </Form.Field>
);
