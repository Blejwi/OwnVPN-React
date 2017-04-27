import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import IpAddressFields from './IpAddressFields';
import Input from '../../form/Input';
import { required } from '../../../utils/validators';
import Radio from '../../form/Radio';
import LABELS from '../../../constants/labels';
import { MODE } from '../../../constants/servers';

const isOn = serverMode => serverMode === MODE.BRIDGE;

export default ({ change, serverMode }) => (
  <Segment padded>
    <Header as="h5">{LABELS.ETHERNET_SERVER_MODE}</Header>
    <Field
            component={Radio}
            name="config.server_mode"
            label={LABELS.SERVER_MODE}
            radio
            defaultValue={MODE.BRIDGE}
            currentValue={serverMode}
            change={change}
    />
    <IpAddressFields name="config.server_bridge" disabled={!isOn(serverMode)} />
    <Field
            name="config.server_bridge.start"
            component={Input}
            label={LABELS.START}
            placeholder="10.8.0.50"
            disabled={!isOn(serverMode)}
            required={isOn(serverMode)}
            validate={isOn(serverMode) && [required]}
    />
    <Field
            name="config.server_bridge.end"
            component={Input}
            label={LABELS.END}
            placeholder="10.8.0.100"
            disabled={!isOn(serverMode)}
            required={isOn(serverMode)}
            validate={isOn(serverMode) && [required]}
    />
  </Segment>
);
