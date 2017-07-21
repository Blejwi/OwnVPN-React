import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import { isUndefined } from 'lodash';
import Select from '../../form/Select';
import { YES_NO_OPTIONS } from '../../../constants/servers';
import LABELS from '../../../constants/labels';

const isOn = (obj, key) => isUndefined(obj) || obj[key] === 'true';

/**
 * Redirect gateway custom field
 * @param {object} redirectGateway Redirect gateway config option
 */
export default ({ redirectGateway }) => (
  <Segment padded>
    <Header as="h5">{LABELS.REDIRECT_GATEWAY}</Header>
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.local"
            label={LABELS.LOCAL}
            disabled={isOn(redirectGateway, 'auto_local')}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.auto_local"
            label={LABELS.AUTO_LOCAL}
            disabled={isOn(redirectGateway, 'local')}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.def1"
            label={LABELS.DEF1}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.bypass_dhcp"
            label={LABELS.BYPASS_DHCP}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.bypass_dns"
            label={LABELS.BYPASS_DNS}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.block_local"
            label={LABELS.BLOCK_LOCAL}
    />
  </Segment>
);
