import React from 'react';
import { Form, Header, Segment, Button } from 'semantic-ui-react';
import { reduxForm } from 'redux-form';
import Actions from '../form/Actions';
import ServerInformationFields from './fields/ServerInformationFields';
import CertificateInformationFields from './fields/CertificateInformationFields';
import VpnConfigurationFields from './fields/VpnConfigurationFields';

const ServerForm = (props) => {
    const {
        handleSubmit,
        onSubmit,
        onPreview,
        submitting,
        pristine,
        reset,
        change,
        ...rest
    } = props;

    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Header as="h1">Server Form</Header>
        <ServerInformationFields change={change} />
        <CertificateInformationFields />
        <VpnConfigurationFields
                change={change}
                {...rest}
        />
        <Segment vertical>
          <Actions submitting={submitting} pristine={pristine} reset={reset}>
            <Button onClick={onPreview} type="button">Preview</Button>
          </Actions>
        </Segment>
      </Form>
    );
};

export default reduxForm({
    form: 'server',
})(ServerForm);
