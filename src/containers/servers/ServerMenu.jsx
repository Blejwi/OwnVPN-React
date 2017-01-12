import React from 'react';
import {Menu} from 'semantic-ui-react';

export default class ServerMenu extends React.Component {
    render() {
        return (
            <Menu secondary>
                <Menu.Item name={"Server 1"} />
            </Menu>
        )
    }
}