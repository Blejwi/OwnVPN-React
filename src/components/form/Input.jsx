import React from 'react';
import {Form} from 'semantic-ui-react';

export default ({ input, label, type, meta: { touched, error } }) => (
    <Form.Field>
        <label>{label}</label>
        <input {...input} placeholder={label} type={type} />
        {touched && (error && <Message error>{error}</Message>)}
    </Form.Field>
);