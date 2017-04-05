import React from 'react';
import {Form} from 'semantic-ui-react';

import Label from './Label';
import Error from './Error';

export default ({input, label, help_message, type, required, readOnly, action, meta: {touched, error}}) => (
    <Form.Field>
        <Form.Input
            {...input}
            action={action}
            readOnly={readOnly}
            placeholder={label}
            label={<Label help_message={help_message}>{label}</Label>}
            type={type}
            required={required}
        />
        <Error touched={touched} error={error}/>
    </Form.Field>
);
