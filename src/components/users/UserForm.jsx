import React from 'react';
import {Form, Header} from 'semantic-ui-react';
import {Field, reduxForm} from 'redux-form';
import Input from '../form/Input';
import Actions from '../form/Actions';

const UserForm = ({handleSubmit, onSubmit, submitting, pristine, reset}) => (
    <Form onSubmit={handleSubmit(onSubmit)}>
        <Header as="h1">User Form</Header>
        <Header as="h2">User information</Header>
        <Field component={Input} name="name" label="Name" required/>
        <Field component={Input} name="ipAddress" label="IP Address" required/>
        <Actions submitting={submitting} pristine={pristine} reset={reset}/>
    </Form>
);

export default reduxForm({
    form: 'user'
})(UserForm);
