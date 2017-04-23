import React from 'react';
import {Form, Checkbox} from 'semantic-ui-react';
import Error from './Error';

const handleChange = (change, name) => (event, {name, checked}) => change(name, checked);

export default ({input, label, required, change, meta: {touched, error}}) => (
    <Form.Field>
        <Checkbox
            {...input}
            label={{children: label}}
            required={required}
            onChange={handleChange(change)}
        />
        <Error touched={touched} error={error}/>
    </Form.Field>
);
