import React from 'react';
import { Form, Header, Segment, Button } from 'semantic-ui-react';
import { reduxForm } from 'redux-form';
import Actions from '../form/Actions';
import ServerInformationFields from './fields/ServerInformationFields';
import CertificateInformationFields from './fields/CertificateInformationFields';
import VpnConfigurationFields from './fields/VpnConfigurationFields';

/**
 * Server edit and add form
 * @param {object} props Attributes of form
 * @returns {XML} Rendered view
 */
const ServerForm = (props) => {
    const {
        error,
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
        {error && <strong>{error}</strong>}
      </Form>
    );
};

/**
 * Server edit and add form component
 */
export default reduxForm({
    form: 'server',
})(ServerForm);
