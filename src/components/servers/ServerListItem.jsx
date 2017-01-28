import React from 'react';
import {Link} from 'react-router';
import {Menu} from 'semantic-ui-react';

export default ({server}) => (
    <Menu.Item>
        <Link to={`/server/${server.id}`}>{server.name}</Link>
    </Menu.Item>
);