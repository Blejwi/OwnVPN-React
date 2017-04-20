import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Array from '../../form/Array';
import File from '../../form/File';
import Input from '../../form/Input';
import Select from '../../form/Select';
import IpAddressFields from './IpAddressFields';
import ServerModeFields from './ServerModeFields';
import BridgingModeFields from './BridgingModeFields';
import AssignSpecificIpFields from './AssignSpecificIpFields';
import AllowSubnetFields from './AllowSubnetFields';
import RedirectGatewayFields from './RedirectGatewayFields';
import KeepAliveFields from './KeepAliveFields';
import {maxValue, minValue, required} from '../../../utils/validators';
import {
    AUTH_OPTIONS,
    CIPHER_OPTIONS,
    DEV_OPTIONS,
    PROTOCOL_OPTIONS,
    YES_NO_OPTIONS,
    LOG_LEVEL_OPIONS,
    TOPOLOGY_OPTIONS
} from '../../../constants/servers';
import * as HELP_MESSAGE from '../../../constants/help_messages';

export default ({change, serverMode, devMode, allowSubnet, assignIp, redirectGateway}) => (
    <Segment vertical>
        <Header as="h2">VPN Configuration</Header>
        <Field
            component={Input}
            name="config.local_ip_address"
            label="Local IP address"
            helpMessage={HELP_MESSAGE.LOCAL_IP_ADDRESS}
        />
        <Field
            component={Input}
            name="config.port"
            type="number"
            label="Listen port"
            helpMessage={HELP_MESSAGE.PORT}
            min="1"
            max="65535"
            required
            validate={[required, minValue(1), maxValue(65535)]}
        />
        <Field
            component={Select}
            name="config.protocol"
            options={PROTOCOL_OPTIONS}
            label="Protocol"
            helpMessage={HELP_MESSAGE.PROTOCOL}
            required
            validate={[required]}
        />
        <Field
            component={Select}
            name="config.dev"
            options={DEV_OPTIONS}
            label="Tunnel type - dev"
            helpMessage={HELP_MESSAGE.DEV}
            required
            validate={[required]}
        />
        <Field
            component={Select}
            name="config.topology"
            label="Topology"
            helpMessage={HELP_MESSAGE.TOPOLOGY}
            options={TOPOLOGY_OPTIONS}
        />
        <ServerModeFields
            change={change}
            serverMode={serverMode}
        />
        <BridgingModeFields
            change={change}
            serverMode={serverMode}
        />
        <AllowSubnetFields
            change={change}
            serverMode={serverMode}
            devMode={devMode}
            assignIp={assignIp}
            allowSubnet={allowSubnet}
        />
        <AssignSpecificIpFields
            change={change}
            assignIp={assignIp}
            allowSubnet={allowSubnet}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="ifconfig_pool_persist"
            label="Maintain a record of client <-> virtual IP address"
        />
        <Array
            name="config.routes"
            label="Push routes to allow the client access other private subnets"
            component={IpAddressFields}
        />
        <Field
            component={File}
            change={change}
            name="learn_address"
            label="Learn address script"
            helpMessage={HELP_MESSAGE.LEARN_ADDRESS}
        />
        <RedirectGatewayFields
            redirectGateway={redirectGateway}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.client_to_client"
            label="Allow different clients to 'see' each other"
            required
            validate={[required]}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.duplicate_cn"
            label="Allow multiple clients to connect with the same certificate/key"
            required
            validate={[required]}
        />
        <KeepAliveFields/>
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.tls_auth"
            label="TLS-Auth"
            helpMessage={HELP_MESSAGE.TLS_AUTH}
            required
            validate={[required]}
        />
        <Field
            component={Select}
            name="config.auth_algorithm"
            options={AUTH_OPTIONS}
            label="Auth algorithm"
            required
            validate={[required]}
        />
        <Field
            component={Select}
            name="config.cipher_algorithm"
            options={CIPHER_OPTIONS}
            label="Cipher algorithm"
            helpMessage={HELP_MESSAGE.CIPHER_ALGORITHM}
            required
            validate={[required]}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.compress"
            label="Enable compression"
            required
            validate={[required]}
        />
        <Field
            component={Input}
            name="config.max_clients"
            label="Max clients"
            type="number"
            helpMessage={HELP_MESSAGE.MAX_CLIENTS}
        />
        <Field
            component={Input}
            name="config.user_privilege"
            label="User privilege"
            helpMessage={HELP_MESSAGE.USER_PRIVILEGE}
        />
        <Field
            component={Input}
            name="config.group_privilege"
            label="Group privilege"
            helpMessage={HELP_MESSAGE.GROUP_PRIVILEGE}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.persist_key"
            label="Persist key"
            required
            validate={[required]}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.persist_tun"
            label="Persist tunnel"
            required
            validate={[required]}
        />
        <Field
            component={Select}
            options={LOG_LEVEL_OPIONS}
            name="config.verb"
            label="Log level"
            required
            validate={[required]}
        />
        <Field
            component={Input}
            name="config.mute"
            type="number"
            label="Mute"
            helpMessage={HELP_MESSAGE.MUTE}
            validate={[minValue(0)]}
        />
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.explicit_exit_notify"
            label="Notify the client when the server restarts"
            required
            validate={[required]}
        />
    </Segment>
);
