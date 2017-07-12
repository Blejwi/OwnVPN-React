import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import Radio from '../../form/Radio';
import IpAddressFields from './IpAddressFields';
import LABELS from '../../../constants/labels';
import { MODE } from '../../../constants/servers';

const isOn = serverMode => serverMode === MODE.SERVER;

/**
 * Server mode custom field
 * @param {function} change
 * @param {string} serverMode Server mode config option
 */
export default ({ change, serverMode }) => (
  <Segment padded>
    <Header as="h5">{LABELS.SERVER_MODE}</Header>
    <Field
            component={Radio}
            name="config.server_mode"
            label={LABELS.ENABLED}
            radio
            change={change}
            defaultValue={MODE.SERVER}
            currentValue={serverMode}
    />
    <IpAddressFields name="config.server" disabled={!isOn(serverMode)} />
  </Segment>
);
