import React from 'react';
import {Button, Form} from 'semantic-ui-react';
import {Field, reduxForm} from 'redux-form';
import Input from '../form/Input';

const ServerForm = ({handleSubmit, onSubmit, submitting, pristine}) => (
    <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group widths="2">
            <Field component={Input} name="name" label="Name" required/>
            <Field component={Input} name="ipAddres" label="IP Address" required/>
        </Form.Group>
        <Button type="submit" disabled={pristine || submitting}>Submit</Button>
    </Form>
);

export default reduxForm({
    form: 'server'
})(ServerForm);