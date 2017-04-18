import React from 'react';
import {Form} from 'semantic-ui-react';

import Label from './Label';
import Error from './Error';

export default ({input, label, helpMessage, type, required, readOnly, action, placeholder, meta: {touched, error}}) => (
    <Form.Field>
        <Form.Input
            {...input}
            action={action}
            readOnly={readOnly}
            placeholder={placeholder || label}
            label={<Label helpMessage={helpMessage}>{label}</Label>}
            type={type}
            required={required}
        />
        <Error touched={touched} error={error}/>
    </Form.Field>
);
