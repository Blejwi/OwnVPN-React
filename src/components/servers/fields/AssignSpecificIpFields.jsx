import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import Checkbox from '../../form/Checkbox';
import IpAddressFields from './IpAddressFields';
import LABELS from '../../../constants/labels';

export default ({ allowSubnet, assignIp, change }) => (
    !allowSubnet ? (
      <Segment padded>
        <Header as="h5">{LABELS.ASSIGN_IP}</Header>
        <Field
                component={Checkbox}
                name="config.assign_ip"
                label={LABELS.ENABLED}
                change={change}
        />
        <IpAddressFields name="config.assign_ip_route" disabled={!assignIp} />
      </Segment>
    ) : <span />
);
