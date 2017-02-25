import React from 'react';
import {Menu} from 'semantic-ui-react';
import {map} from 'lodash';
import ServerListItem from './ServerListItem';
import AddServerButton from './AddServerButton';

export default ({servers}) => (
    <Menu secondary vertical fluid>
        <AddServerButton/>
        {map(servers, (server, key) => <ServerListItem key={key} server={server} />)}
    </Menu>
);