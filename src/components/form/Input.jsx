import React from 'react';
import {Form, Popup} from 'semantic-ui-react';

export default ({ input, label, help_message, type, required, meta: { touched, error } }) => {
    let label_element = (<label>{label}</label>);

    if (help_message) {
        label_element = (
            <Popup trigger={label_element}>
                <Popup.Content>{ help_message }</Popup.Content>
            </Popup>
        );
    }

    return (
        <Form.Field>
            {label_element}
            <input {...input} placeholder={label} type={type} required={required}/>
            {touched && (error && <Message error>{error}</Message>)}
        </Form.Field>
    );
};
