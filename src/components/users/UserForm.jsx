import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import Input from '../form/Input';
import Select from '../form/Select';
import Actions from '../form/Actions';
import { YES_NO_OPTIONS } from '../../constants/servers';
import LABELS from '../../constants/labels';
import { ipAddress, maxValue, minValue } from '../../utils/validators';
import { normalizeIpAddress } from '../servers/fields/IpAddressFields';

/**
 * User edit and add form
 * @param params Data and actions for component
 * @returns {XML} Rendered component
 */
const UserForm = (params) => {
    const { handleSubmit, onSubmit, submitting, pristine, reset } = params;
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Header as="h1">User Form</Header>
        <Segment vertical>
          <Header as="h2">User information</Header>
          <Field component={Input} name="name" label="Name" required />
          <Field component={Input} name="ipAddress" label="IP Address" required />
        </Segment>
        <Segment vertical>
          <Header as="h2">VPN configuration</Header>
          <Field
                    component={Select}
                    name="config.muteReplayWarnings"
                    label={LABELS.MUTE_REPLAY_WARNINGS}
                    options={YES_NO_OPTIONS}
          />
          <Field
                    component={Input}
                    name="config.httpProxyServer"
                    label={LABELS.HTTP_PROXY_SERVER}
                    validate={[ipAddress]}
                    normalize={normalizeIpAddress}
          />
          <Field
                    component={Input}
                    name="config.httpProxyPort"
                    label={LABELS.HTTP_PROXY_PORT}
                    type="number"
                    min="1"
                    max="65535"
                    step="1"
                    validate={[minValue(1), maxValue(65535)]}
          />
          <Field
                    component={Select}
                    name="config.httpProxyRetry"
                    label={LABELS.HTTP_PROXY_RETRY}
                    options={YES_NO_OPTIONS}
          />
        </Segment>
        <Actions submitting={submitting} pristine={pristine} reset={reset} />
      </Form>
    );
};

export default reduxForm({
    form: 'user',
})(UserForm);
