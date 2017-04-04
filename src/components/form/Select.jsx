import React from 'react';
import {Form} from 'semantic-ui-react';
import {map} from 'lodash';
import Label from './Label';
import Error from './Error';

export default ({input, label, options, help_message, required, meta: {touched, error}}) => (
    <Form.Field>
        <Label help_message={help_message}>{label}</Label>
        <select {...input} placeholder={label} required={required}>
            {map(options, (option, key) => <option key={key} value={option.value} >{option.text}</option>)}
        </select>
        <Error touched={touched} error={error}/>
    </Form.Field>
);