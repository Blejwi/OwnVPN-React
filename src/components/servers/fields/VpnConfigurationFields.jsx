import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import File from '../../form/File';
import Input from '../../form/Input';
import Select from '../../form/Select';
import RoutesFields from './RoutesFields';
import ServerModeFields from './ServerModeFields';
import BridgingModeFields from './BridgingModeFields';
import AssignSpecificIpFields from './AssignSpecificIpFields';
import AllowSubnetFields from './AllowSubnetFields';
import RedirectGatewayFields from './RedirectGatewayFields';
import KeepAliveFields from './KeepAliveFields';
import { maxValue, minValue, required } from '../../../utils/validators';
import {
    AUTH_OPTIONS,
    CIPHER_OPTIONS,
    DEV_OPTIONS,
    PROTOCOL_OPTIONS,
    YES_NO_OPTIONS,
    LOG_LEVEL_OPIONS,
    TOPOLOGY_OPTIONS,
} from '../../../constants/servers';
import * as HELP_MESSAGE from '../../../constants/help_messages';
import LABELS from '../../../constants/labels';

export default ({ change, serverMode, devMode, allowSubnet, assignIp, redirectGateway }) => (
  <Segment vertical>
    <Header as="h2">VPN Configuration</Header>
    <Field
            component={Input}
            name="config.local_ip_address"
            label={LABELS.LOCAL_IP_ADDRESS}
            helpMessage={HELP_MESSAGE.LOCAL_IP_ADDRESS}
    />
    <Field
            component={Input}
            name="config.port"
            type="number"
            label={LABELS.LISTEN_PORT}
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
            label={LABELS.PROTOCOL}
            helpMessage={HELP_MESSAGE.PROTOCOL}
            required
            validate={[required]}
    />
    <Field
            component={Select}
            name="config.dev"
            options={DEV_OPTIONS}
            label={LABELS.DEV}
            helpMessage={HELP_MESSAGE.DEV}
            required
            validate={[required]}
    />
    <Field
            component={Select}
            name="config.topology"
            label={LABELS.TOPOLOGY}
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
            label={LABELS.IFCONFIG_POOL_PERSIST}
    />
    <RoutesFields />
    <Field
            component={File}
            change={change}
            name="config.learn_address"
            label={LABELS.LEARN_ADDRESS}
            helpMessage={HELP_MESSAGE.LEARN_ADDRESS}
    />
    <RedirectGatewayFields
            redirectGateway={redirectGateway}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.client_to_client"
            label={LABELS.CLIENT_TO_CLIENT}
            required
            validate={[required]}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.duplicate_cn"
            label={LABELS.DUPLICATE_CN}
            required
            validate={[required]}
    />
    <KeepAliveFields />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.tls_auth"
            label={LABELS.TLS_AUTH}
            helpMessage={HELP_MESSAGE.TLS_AUTH}
            required
            validate={[required]}
    />
    <Field
            component={Select}
            name="config.auth_algorithm"
            options={AUTH_OPTIONS}
            label={LABELS.AUTH_ALGORITHM}
            required
            validate={[required]}
    />
    <Field
            component={Select}
            name="config.cipher_algorithm"
            options={CIPHER_OPTIONS}
            label={LABELS.CIPHER_ALGORITHM}
            helpMessage={HELP_MESSAGE.CIPHER_ALGORITHM}
            required
            validate={[required]}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.compress"
            label={LABELS.COMPRESS}
            required
            validate={[required]}
    />
    <Field
            component={Input}
            name="config.max_clients"
            label={LABELS.MAX_CLIENTS}
            type="number"
            helpMessage={HELP_MESSAGE.MAX_CLIENTS}
    />
    <Field
            component={Input}
            name="config.user_privilege"
            label={LABELS.USER_PRIVILEGE}
            helpMessage={HELP_MESSAGE.USER_PRIVILEGE}
    />
    <Field
            component={Input}
            name="config.group_privilege"
            label={LABELS.GROUP_PRIVILEGE}
            helpMessage={HELP_MESSAGE.GROUP_PRIVILEGE}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.persist_key"
            label={LABELS.PERSIST_KEY}
            required
            validate={[required]}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.persist_tun"
            label={LABELS.PERSIST_TUN}
            required
            validate={[required]}
    />
    <Field
            component={Select}
            options={LOG_LEVEL_OPIONS}
            name="config.verb"
            label={LABELS.VERB}
            required
            validate={[required]}
    />
    <Field
            component={Input}
            name="config.mute"
            type="number"
            label={LABELS.MUTE}
            helpMessage={HELP_MESSAGE.MUTE}
            validate={[minValue(0)]}
    />
    <Field
            component={Select}
            options={YES_NO_OPTIONS}
            name="config.explicit_exit_notify"
            label={LABELS.EXPLICIT_EXIT_NOTIFY}
            required
            validate={[required]}
    />
  </Segment>
);
