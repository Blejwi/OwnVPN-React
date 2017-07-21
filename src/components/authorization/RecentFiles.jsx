import React from 'react';
import { Divider, List } from 'semantic-ui-react';
import { map } from 'lodash';

/**
 * Displays list of recently opened configuration files
 * @param {string[]} recentFiles Recently opened configuration files
 * @param {function} handleClick Handles click event
 */
export default ({ recentFiles, handleClick }) => (
  <div>
    <Divider horizontal>Recent files</Divider>
    <List link>
      {map(recentFiles, (filename, key) => (
        <List.Item as="a" key={key} onClick={() => handleClick(filename)}>
          {filename}
        </List.Item>
            ))}
    </List>
  </div>
);
