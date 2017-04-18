import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Radio from '../../form/Radio';
import IpAddressFields from './IpAddressFields';

export default ({change, serverMode}) => (
    <Segment padded={true}>
        <Header as="h5">Server mode</Header>
        <Field
            component={Radio}
            name="server_mode"
            label="Enabled"
            radio
            change={change}
            defaultValue="server"
            currentValue={serverMode}
        />
        <IpAddressFields name="server"/>
    </Segment>
);
