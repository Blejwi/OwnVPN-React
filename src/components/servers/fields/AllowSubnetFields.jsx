import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Checkbox from '../../form/Checkbox';
import IpAddressFields from './IpAddressFields';

export default ({serverMode, devMode, assignIp, allowSubnet, change}) => (
    (!assignIp && serverMode === 'server' && devMode === 'tun') ? (
        <Segment padded={true}>
            <Header as="h5">Allow client's private subnet to access the VPN</Header>
            <Field
                component={Checkbox}
                name="config.allow_subnet"
                label="Enabled"
                change={change}
            />
            <IpAddressFields name="config.allow_subnet_route" disabled={!allowSubnet}/>
        </Segment>
    ) : <span/>
);
