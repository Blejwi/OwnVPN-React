import React from 'react';
import { Form, Checkbox } from 'semantic-ui-react';
import Error from './Error';

const handleChange = change => (event, { name, value }) => change(name, value);

export default (props) => {
    const {
        input,
        label,
        required,
        disabled,
        defaultValue,
        currentValue,
        change,
        meta: {
            touched,
            error,
        },
    } = props;

    return (
      <Form.Field>
        <Checkbox
                {...input}
                label={{ children: label }}
                radio
                onChange={handleChange(change)}
                required={required}
                checked={currentValue === defaultValue}
                value={defaultValue}
                disabled={disabled}
        />
        <Error touched={touched} error={error} disabled={disabled} />
      </Form.Field>
    );
};
