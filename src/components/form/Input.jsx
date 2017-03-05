import React from 'react';
import {Form, Popup} from 'semantic-ui-react';
import {map} from 'lodash';

export default ({ input, label, input_type, options, help_message, type, required, meta: { touched, error } }) => {
    let label_element = (<label>{label}</label>);

    if (help_message) {
        label_element = (
            <Popup trigger={label_element}>
                <Popup.Content>{ help_message }</Popup.Content>
            </Popup>
        );
    }

    let input_element = null;
    switch (input_type) {
        case 'textarea':
            input_element = <Form.TextArea {...input} placeholder={label} required={required}/>;
            break;
        case 'select':
            input_element = (
                <select {...input} placeholder={label} required={required} >
                    {map(options, (option, key) => <option key={key} value={option.value}>{option.text}</option>)}
                </select>
            );
            break;
        default:
            input_element = <Form.Input {...input} placeholder={label} type={type} required={required}/>;
    }

    return (
        <Form.Field>
            {label_element}
            {input_element}
            {touched && (error && <Message error>{error}</Message>)}
        </Form.Field>
    );
};
