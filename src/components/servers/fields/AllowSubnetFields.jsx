import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Checkbox from '../../form/Checkbox';
import IpAddressFields from './IpAddressFields';
import LABELS from '../../../constants/labels';

export default ({serverMode, devMode, assignIp, allowSubnet, change}) => (
    (!assignIp && serverMode === 'server' && devMode === 'tun') ? (
        <Segment padded={true}>
            <Header as="h5">{LABELS.ALLOW_SUBNET}</Header>
            <Field
                component={Checkbox}
                name="config.allow_subnet"
                label={LABELS.ENABLED}
                change={change}
            />
            <IpAddressFields name="config.allow_subnet_route" disabled={!allowSubnet}/>
        </Segment>
    ) : <span/>
);
