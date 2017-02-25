import React from 'react';
import {Form} from 'semantic-ui-react';

export default ({ input, label, required, meta: { touched, error } }) => (
    <Form.Field>
        <Form.TextArea {...input} label={label} required={required} />
        {touched && (error && <Message error>{error}</Message>)}
    </Form.Field>
);