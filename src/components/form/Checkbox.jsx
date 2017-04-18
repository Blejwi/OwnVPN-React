import React from 'react';
import {Form, Checkbox} from 'semantic-ui-react';
import Error from './Error';

export default ({input, label, required, meta: {touched, error}}) => (
    <Form.Field>
        <Checkbox
            {...input}
            label={{children: label}}
            required={required}
        />
        <Error touched={touched} error={error}/>
    </Form.Field>
);
