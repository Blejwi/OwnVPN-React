import React from 'react';
import { Message } from 'semantic-ui-react';

/**
 * User warning shown config option dev is not set to 'tun'
 * @param {bool} show Indicates if warning should be shown
 */
export default ({ show }) => (
    show ? (
      <Message warning>
        <Message.Header>Users IP addresses read-only</Message.Header>
        <p>
            If you want to setup users IP addresses on server, you need to use routed VPN (dev tun).
        </p>
      </Message>
    ) : null
);
