import React from 'react';
import {Form, Header} from 'semantic-ui-react';
import {Field, reduxForm} from 'redux-form';
import Input from '../form/Input';
import TextArea from '../form/TextArea';
import Actions from '../form/Actions';

const ServerForm = ({handleSubmit, onSubmit, submitting, pristine, reset}) => (
    <Form onSubmit={handleSubmit(onSubmit)}>
        <Header as="h1">Server Form</Header>
        <Header as="h2">Server information</Header>
        <Field component={Input} name="name" label="Name" required/>
        <Field component={Input} name="host" label="Host address" required/>
        <Field component={Input} name="password" label="Password" type="password"/>
        <Field component={Input} name="port" label="Port" type="number" min="1" max="65535" step="1"/>
        <Field component={TextArea} name="key" label="RSA private key"/>

        <Header as="h2">Certificate information</Header>
        <Field component={Input} name="country" label="Country"/>
        <Field component={Input} name="province" label="Province"/>
        <Field component={Input} name="city" label="City"/>
        <Field component={Input} name="org" label="Organization"/>
        <Field component={Input} name="email" label="E-mail" type="email"/>
        <Field component={Input} name="ou" label="Organizational unit"/>

        <Header as="h2">Configuration options</Header>
        <Field component={Input} help_message="Which local IP address should OpenVPN listen on? (optional)" name="local_ip_address" label="Local ip address"/>
        <Field component={Input} help_message="Which TCP/UDP port should OpenVPN listen on? If you want to run multiple OpenVPN instances on the same machine, use a different port number for each one.  You will need to open up this port on your firewall." name="local_port" label="Local port"/>

        <Actions submitting={submitting} pristine={pristine} reset={reset}/>
    </Form>
);

export default reduxForm({
    form: 'server'
})(ServerForm);
