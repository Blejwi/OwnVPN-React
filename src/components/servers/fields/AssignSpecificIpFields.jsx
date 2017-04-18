import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Checkbox from '../../form/Checkbox';
import IpAddressFields from "./IpAddressFields";

export default ({allowSubnet, assignIp, change}) => (
    !allowSubnet ? (
        <Segment padded={true}>
            <Header as="h5">Assign specific IP addresses to specific clients</Header>
            <Field
                component={Checkbox}
                name="config.assign_ip"
                label="Enabled"
                change={change}
            />
            <IpAddressFields name="config.assign_ip_route" disabled={!assignIp}/>
        </Segment>
    ) : <span/>
);
