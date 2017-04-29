import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

export default ({ active }) => (
  <Menu.Item active={active} link as={Link} to="/server/add">
    <Icon name="add" /> Add Server
  </Menu.Item>
);
