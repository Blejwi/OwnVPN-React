import React from 'react';
import {Form, Checkbox} from 'semantic-ui-react';
import Error from './Error';

const handleChange = (change, name) => (event, {name, value}) => change(name, value);

export default ({input, label, required, defaultValue, currentValue, change, meta: {touched, error}}) => {
    return (
        <Form.Field>
            <Checkbox
                {...input}
                label={{children: label}}
                radio={true}
                onChange={handleChange(change)}
                required={required}
                checked={currentValue === defaultValue}
                value={defaultValue}
            />
            <Error touched={touched} error={error}/>
        </Form.Field>
    );
};
