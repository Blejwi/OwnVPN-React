import React from 'react';
import {Menu} from 'semantic-ui-react';
import {map} from 'lodash';
import ServerListItem from './ServerListItem';
import AddServerButton from './AddServerButton';

export default ({servers, activeMenuItem}) => (
    <Menu vertical inverted fluid>
        {map(servers, (server, key) => <ServerListItem key={key} server={server} active={server.id === activeMenuItem} />)}
        <AddServerButton active={activeMenuItem === 'add'}/>
    </Menu>
);
