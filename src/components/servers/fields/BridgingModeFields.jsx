import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import IpAddressFields from './IpAddressFields';
import Input from '../../form/Input';
import {required} from '../../../utils/validators';
import Radio from '../../form/Radio';

const isOn = serverMode => serverMode === 'bridge';

export default ({change, serverMode}) => (
    <Segment padded={true}>
        <Header as="h5">Server mode for ethernet bridging</Header>
        <Field
            component={Radio}
            name="config.server_mode"
            label="Enabled"
            radio
            defaultValue="bridge"
            currentValue={serverMode}
            change={change}
        />
        <IpAddressFields name="config.server_bridge" disabled={!isOn(serverMode)}/>
        <Field
            name="config.server_bridge.start"
            component={Input}
            label="Start range"
            placeholder="10.8.0.50"
            disabled={!isOn(serverMode)}
            required={isOn(serverMode)}
            validate={isOn(serverMode) && [required]}
        />
        <Field
            name="config.server_bridge.end"
            component={Input}
            label="End range"
            placeholder="10.8.0.100"
            disabled={!isOn(serverMode)}
            required={isOn(serverMode)}
            validate={isOn(serverMode) && [required]}
        />
    </Segment>
);
