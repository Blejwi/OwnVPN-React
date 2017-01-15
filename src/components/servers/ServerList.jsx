import React from 'react';
import {Menu} from 'semantic-ui-react';
import {map} from 'lodash';
import ServerListItem from './ServerListItem';

export default ({servers}) => (
    <Menu secondary vertical>
        {map(servers, (server, key) => <ServerListItem key={key} server={server} />)}
    </Menu>
);