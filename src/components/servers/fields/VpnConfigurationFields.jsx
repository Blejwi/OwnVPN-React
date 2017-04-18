import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Array from '../../form/Array';
import Checkbox from '../../form/Checkbox';
import File from '../../form/File';
import Input from '../../form/Input';
import Select from '../../form/Select';
import IpAddressFields from './IpAddressFields';
import {maxValue, minValue, required} from '../../../utils/validators';
import {AUTH_OPTIONS, CIPHER_OPTIONS, DEV_OPTIONS, PROTOCOL_OPTIONS, YES_NO_OPTIONS, LOG_LEVEL_OPIONS} from '../../../constants/servers';

export default ({change}) => (
    <Segment vertical>
        <Header as="h2">VPN Configuration</Header>
        <Field
            component={Input}
            name="config.local_ip_address"
            label="Local IP address (optional)"
            help_message="Which local IP address should OpenVPN listen on? (optional) Enter valid ip address or leave empty"
        />
        <Field
            component={Input}
            name="config.port"
            type="number"
            label="Listen port"
            help_message="Which TCP/UDP port should OpenVPN listen on?"
            min="1" max="65535" required
            validate={[required, minValue(1), maxValue(65535)]}
        />
        <Field
            component={Select}
            name="config.protocol"
            options={PROTOCOL_OPTIONS}
            label="Protocol"
            help_message="TCP or UDP server?"
            required
            validate={[required]}
        />
        <Field
            component={Select}
            name="config.dev"
            options={DEV_OPTIONS}
            label="Dev"
            help_message='"dev tun" will create a routed IP tunnel,
                        "dev tap" will create an ethernet tunnel.
                        Use "dev tap0" if you are ethernet bridging
                        and have precreated a tap0 virtual interface
                        and bridged it with your ethernet interface.
                        If you want to control access policies
                        over the VPN, you must create firewall
                        rules for the the TUN/TAP interface.
                        On non-Windows systems, you can give
                        an explicit unit number, such as tun0.
                        On Windows, use "dev-node" for this.
                        On most systems, the VPN will not function
                        unless you partially or fully disable
                        the firewall for the TUN/TAP interface.'
            required
            validate={[required]}
        />
        <Field
            component={Input}
            name="config.dev_node"
            label="Dev-node"
            help_message='Windows needs the TAP-Win32 adapter name
                        from the Network Connections panel if you
                        have more than one.  On XP SP2 or higher,
                        you may need to selectively disable the
                        Windows firewall for the TAP adapter.
                        Non-Windows systems usually dont need this.'
        />
        <Field
            component={Input}
            name="config.topology"
            label="Topology"
            help_message="Network topology should be subnet (addressing via IP)
                          unless Windows clients v2.0.9 and lower have to be supported
                          (then net30, i.e. a /30 per client) defaults to net30 (not recommended)"
            options={['subnet', 'net30', 'p2p']}
        />
        <Segment padded={true}>
            <Header as="h5">Server mode</Header>
            <Field
                component={Checkbox}
                name="server.enabled"
                label="Enabled"
            />
            <IpAddressFields name="server"/>
        </Segment>
        <Field
            component={File}
            change={change}
            name="ifconfigPoolPersist"
            label="Ifconfig pool persist"
            disabled
        />
        <Segment padded={true}>
            <Header as="h5">Server mode for ethernet bridging</Header>
            <Field
                component={Checkbox}
                name="server_bridge.enabled"
                label="Enabled"
            />
            <IpAddressFields name="server_bridge"/>
            <Field
                name="server_bridge.start"
                component={Input}
                label="Start range"
                placeholder="10.8.0.50"
                required
                validate={[required]}
            />
            <Field
                name="server_bridge.end"
                component={Input}
                label="End range"
                placeholder="10.8.0.100"
                required
            />
        </Segment>
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
            help_message='
                        For extra security beyond that provided
                        by SSL/TLS, create an "HMAC firewall"
                        to help block DoS attacks and UDP port flooding.'
            required
            validate={[required]}
        />
        <Field
            component={Input}
            name="config.user_privilege"
            label="User privilege"
            help_message="
                        It's a good idea to reduce the OpenVPN
                        daemon's privileges after initialization.
                        You can set this on non-Windows systems."
        />
        <Field
            component={Input}
            name="config.group_privilege"
            label="Group privilege"
            help_message="
                        It's a good idea to reduce the OpenVPN
                        daemon's privileges after initialization.
                        You can set this on non-Windows systems."
        />
        <Field
            component={Input}
            name="config.max_clients"
            label="Max clients"
            type="number"
            help_message="The maximum number of concurrently connected clients we want to allow."
        />
        <Field
            component={Select}
            name="config.auth_algorithm"
            options={AUTH_OPTIONS}
            label="Auth algorithm"
            help_message="Auth algorithm"
            required
            validate={[required]}
        />
        <Field
            component={Select}
            name="config.cipher_algorithm"
            options={CIPHER_OPTIONS}
            label="Cipher algorithm"
            help_message="Select a cryptographic cipher. This config item must be copied to the client config file as well."
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
