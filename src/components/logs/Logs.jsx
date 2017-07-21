import React from 'react';
import { map } from 'lodash';
import { Icon, List } from 'semantic-ui-react';

import './Logs.scss';
import LogItem from './LogItem';

/**
 * Displays logs
 * @param {object[]} logs List of logs
 * @param {bool} collapsed Set if logs should be collapsed
 * @param {function} handleCollapse Handles collapse event
 * @param {function} handleClear Handles clear event
 */
export default ({ logs, collapsed, handleCollapse, handleClear }) => (
  <div className="logs-container">
    <Icon
            onClick={handleCollapse}
            title={collapsed ? 'Expand' : 'Collapse'}
            className="collapse pointer hover-enlarge-1_5"
            name={collapsed ? 'expand' : 'compress'}
    />
    <Icon
            onClick={handleClear}
            title="Clear logs"
            className="collapse pointer hover-enlarge-1_5"
            name="trash outline"
    />
    <pre className={(collapsed ? 'collapsed' : '')}>
      <List divided inverted>
        {map(logs, data => (
          <LogItem key={data.id} {...data} />
        ))}
      </List>
    </pre>
  </div>
);
