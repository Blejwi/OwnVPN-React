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
import {maxValue, minValue, required} from '../../../utils/validators';
import {
    AUTH_OPTIONS,
    CIPHER_OPTIONS,
    DEV_OPTIONS,
    PROTOCOL_OPTIONS,
    YES_NO_OPTIONS,
    LOG_LEVEL_OPIONS
} from '../../../constants/servers';
import * as HELP_MESSAGE from '../../../constants/help_messages';

export default ({change, serverMode}) => (
    <Segment vertical>
        <Header as="h2">VPN Configuration</Header>
        <Field
            component={Input}
            name="config.local_ip_address"
            label="Local IP address (optional)"
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
            label="Dev"
            helpMessage={HELP_MESSAGE.DEV}
            required
            validate={[required]}
        />
        <Field
            component={Input}
            name="config.dev_node"
            label="Dev-node"
            helpMessage={HELP_MESSAGE.DEV_NODE}
        />
        <Field
            component={Input}
            name="config.topology"
            label="Topology"
            helpMessage={HELP_MESSAGE.TOPOLOGY}
            options={['subnet', 'net30', 'p2p']}
        />
        <ServerModeFields
            change={change}
            serverMode={serverMode}
        />
        <BridgingModeFields
            change={change}
            serverMode={serverMode}
        />
        <Field
            component={File}
            change={change}
            name="ifconfigPoolPersist"
            label="Ifconfig pool persist"
            disabled
        />
        <Array
            name="config.routes"
            label="Routes"
            component={IpAddressFields}
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
        <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.compress"
            label="Enable compression"
            required
            validate={[required]}
        />
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
            component={Input}
            name="config.max_clients"
            label="Max clients"
            type="number"
            helpMessage={HELP_MESSAGE.MAX_CLIENTS}
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
            options={LOG_LEVEL_OPIONS}
            name="config.verb"
            label="Log level"
            required
            validate={[required]}
        />
    </Segment>
);
