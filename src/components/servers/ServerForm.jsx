import React from 'react';
import {Form, Header, Segment} from 'semantic-ui-react';
import {reduxForm} from 'redux-form';
import Actions from '../form/Actions';
import ServerInformationFields from './fields/ServerInformationFields';
import CertificateInformationFields from './fields/CertificateInformationFields';
import VpnConfigurationFields from './fields/VpnConfigurationFields';

const ServerForm = ({handleSubmit, onSubmit, submitting, pristine, reset, change, ...props}) => (
    <Form onSubmit={handleSubmit(onSubmit)}>
        <Header as="h1">Server Form</Header>
        <ServerInformationFields change={change}/>
        <CertificateInformationFields/>
        <VpnConfigurationFields
            change={change}
            {...props}
        />
        <Segment vertical>
            <Actions submitting={submitting} pristine={pristine} reset={reset}/>
        </Segment>
    </Form>
);

export default reduxForm({
    form: 'server'
})(ServerForm);
