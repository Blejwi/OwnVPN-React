import React from 'react';
import {Button, Form, Header} from 'semantic-ui-react';
import {Field, reduxForm} from 'redux-form';
import Input from '../form/Input';

const ServerForm = ({handleSubmit, onSubmit, submitting, pristine, reset}) => (
    <Form onSubmit={handleSubmit(onSubmit)}>
        <Header as="h1">Server Form</Header>
        <Form.Group widths="2">
            <Field component={Input} name="name" label="Name" required/>
            <Field component={Input} name="ipAddres" label="IP Address" required/>
            <Field component={Input} name="password" label="Password" type="password"/>
            <Field component={Input} name="port" label="Port"/>
            <Field component={Input} name="key" label="RSA private key" type="file"/>
        </Form.Group>
        <Button primary type="submit" disabled={pristine || submitting}>Submit</Button>
        <Button secondary disabled={pristine || submitting} onClick={reset}>Clear</Button>
    </Form>
);

export default reduxForm({
    form: 'server'
})(ServerForm);