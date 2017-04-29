import React from 'react';
import { map } from 'lodash';
import { Icon, List } from 'semantic-ui-react';

import './Logs.scss';
import LogItem from './LogItem';

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
        {map(logs, (data, key) => (
          <LogItem key={key} {...data} />
        ))}
      </List>
    </pre>
  </div>
);
