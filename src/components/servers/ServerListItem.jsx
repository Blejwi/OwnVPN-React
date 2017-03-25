import React from 'react';
import {Link} from 'react-router';
import {Menu} from 'semantic-ui-react';

export default ({server, active}) => (
    <Menu.Item active={active} link as={Link} to={`/server/show/${server.id}`}>
        {server.name}
    </Menu.Item>
);
