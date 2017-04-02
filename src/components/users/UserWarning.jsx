import React from 'react';
import {Message} from 'semantic-ui-react';

export default ({show}) => (
    show ? (
            <Message warning>
                <Message.Header>
                    Users IP addresses read-only
                </Message.Header>
                <p>
                    If you want to setup users IP addresses on server, you need to use routed VPN (dev tun).
                </p>
            </Message>
        ) : null
);
