import React from 'react';
import {Menu, Button} from 'semantic-ui-react';
import {Link} from 'react-router';

export default () => (
    <Menu.Item>
        <Link to="/server/add">
            <Button>Add Server</Button>
        </Link>
    </Menu.Item>
);
