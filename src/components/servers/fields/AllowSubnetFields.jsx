import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import Checkbox from '../../form/Checkbox';
import IpAddressFields from './IpAddressFields';
import LABELS from '../../../constants/labels';
import { MODE } from '../../../constants/servers';

/**
 * Allow subnet custom field
 * @param {string} serverMode Server mode  config option
 * @param {string} devMode Dev move config option
 * @param {string} assignIp Assign IP  config option
 * @param {string} allowSubnet allow subnet  config option
 * @param {function} change Change function of redux-form
 */
export default ({ serverMode, devMode, assignIp, allowSubnet, change }) => (
    (!assignIp && serverMode === MODE.SERVER && devMode === 'tun') ? (
      <Segment padded>
        <Header as="h5">{LABELS.ALLOW_SUBNET}</Header>
        <Field
                component={Checkbox}
                name="config.allow_subnet"
                label={LABELS.ENABLED}
                change={change}
        />
        <IpAddressFields name="config.allow_subnet_route" disabled={!allowSubnet} />
      </Segment>
    ) : <span />
);
