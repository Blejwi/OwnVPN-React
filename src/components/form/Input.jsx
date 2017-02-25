import React from 'react';
import {Form} from 'semantic-ui-react';

export default ({ input, label, type, required, meta: { touched, error } }) => (
    <Form.Field>
        <label>{label}</label>
        <input {...input} placeholder={label} type={type} required={required} />
        {touched && (error && <Message error>{error}</Message>)}
    </Form.Field>
);