import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

/**
 * Menu add server button
 * @param {bool} active Indicates if button should be active or not
 */
export default ({ active }) => (
  <Menu.Item active={active} link as={Link} to="/server/add">
    <Icon name="add" /> Add Server
  </Menu.Item>
);
