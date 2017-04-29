import React from 'react';
import { Form } from 'semantic-ui-react';
import { map } from 'lodash';
import Label from './Label';
import Error from './Error';

export default (props) => {
    const {
        input,
        label,
        options,
        helpMessage,
        required,
        disabled,
        meta: {
            touched,
            error,
        },
    } = props;

    return (
      <Form.Field className={required ? 'required' : ''}>
        <Label helpMessage={helpMessage}>{label}</Label>
        <select {...input} placeholder={label} required={required} disabled={disabled}>
          {map(options, (option, key) => (
            <option key={key} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <Error touched={touched} error={error} disabled={disabled} />
      </Form.Field>
    );
};
