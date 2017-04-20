import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import {isUndefined} from 'lodash';
import Select from '../../form/Select';
import {YES_NO_OPTIONS} from '../../../constants/servers';

const isOn = (obj, key) => isUndefined(obj) || obj[key] === 'true';

export default ({redirectGateway}) => (
    <Segment padded={true}>
        <Header as="h5">Redirect gateway</Header>
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.local"
            label="Local"
            disabled={isOn(redirectGateway, 'auto_local')}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.auto_local"
            label="Autolocal"
            disabled={isOn(redirectGateway, 'local')}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.def1"
            label="Override default gateway"
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.bypass_dhcp"
            label="Bypass DHCP"
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.bypass_dns"
            label="Bypass DNS"
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.redirect_gateway.block_local"
            label="Block local LAN"
        />
    </Segment>
);
