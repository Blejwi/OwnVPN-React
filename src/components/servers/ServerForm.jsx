import React from 'react';
import {Form, Header, Segment} from 'semantic-ui-react';
import {Field, reduxForm} from 'redux-form';
import Input from '../form/Input';
import Select from '../form/Select';
import File from '../form/File';
import Actions from '../form/Actions';
import {AUTH_OPTIONS, CIPHER_OPTIONS, PROTOCOL_OPTIONS, DEV_OPTIONS, YES_NO_OPTIONS} from '../../constants/servers';
import {required, minValue, maxValue, email} from "../../utils/validators";

const ServerForm = ({handleSubmit, onSubmit, submitting, pristine, reset, change}) => (
    <Form onSubmit={handleSubmit(onSubmit)}>
        <Header as="h1">Server Form</Header>
        <Segment vertical>
            <Header as="h2">Server information</Header>
            <Field
                component={Input}
                name="name"
                label="Name"
                required
                validate={[required]}
            />
            <Field
                component={Input}
                name="host"
                label="Host address"
                required
                validate={[required]}
            />
            <Field
                component={Input}
                name="password"
                label="Password"
                type="password"
            />
            <Field
                component={Input}
                name="port"
                label="Port"
                type="number"
                min="1"
                max="65535"
                step="1"
                required
                validate={[required, minValue(1), maxValue(65535)]}
            />
            <Field
                component={Input}
                name="username"
                label="Username"
                required
                validate={[required]}
            />
            <Field
                component={File}
                change={change}
                type="text"
                name="key"
                label="SSH private key path"
                disabled
            />
        </Segment>
        <Segment vertical>
            <Header as="h2">Certificate information</Header>
            <Field
                component={Input}
                name="country"
                label="Country"
                help_message="Country code, for example: PL, US"
            />
            <Field component={Input} name="province" label="Province"/>
            <Field component={Input} name="city" label="City"/>
            <Field component={Input} name="org" label="Organization"/>
            <Field component={Input} name="email" label="E-mail" type="email" validate={[email]}/>
            <Field component={Input} name="ou" label="Organizational unit"/>
        </Segment>
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
        </Segment>
        <Segment vertical>
            <Actions submitting={submitting} pristine={pristine} reset={reset}/>
        </Segment>
    </Form>
);

export default reduxForm({
    form: 'server'
})(ServerForm);
