import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Radio from '../../form/Radio';
import IpAddressFields from './IpAddressFields';
import LABELS from '../../../constants/labels';

const isOn = serverMode => serverMode === 'server';

export default ({change, serverMode}) => (
    <Segment padded={true}>
        <Header as="h5">{LABELS.SERVER_MODE}</Header>
        <Field
            component={Radio}
            name="config.server_mode"
            label={LABELS.ENABLED}
            radio
            change={change}
            defaultValue="server"
            currentValue={serverMode}
        />
        <IpAddressFields name="config.server" disabled={!isOn(serverMode)}/>
    </Segment>
);
