import React from 'react';
import { Link } from 'react-router';
import { Menu } from 'semantic-ui-react';

/**
 * Server list item
 * @param {object} server Server object
 * @param {bool} active Indicates if link should be marked as active or not
 */
export default ({ server, active }) => (
  <Menu.Item active={active} link as={Link} to={`/server/show/${server.id}`}>
    {server.name}
  </Menu.Item>
);
