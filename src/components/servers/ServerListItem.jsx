import React from 'react';
import {Menu} from 'semantic-ui-react';

export default ({server}) => (
    <Menu.Item>
        <a href={`/server/${server.id}`}>{server.name}</a>
    </Menu.Item>
);