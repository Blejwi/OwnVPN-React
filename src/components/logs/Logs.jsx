import React from 'react';
import { map } from 'lodash';
import { Icon, List } from 'semantic-ui-react';

import './Logs.scss';
import LogItem from './LogItem';
import Scroll from '../utils/Scroll';

export default ({ logs, collapsed, handleCollapse, handleClear }) => (
  <div className={`logs-container ${collapsed ? 'collapsed' : ''}`}>
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
    <Scroll>
      <pre className="smooth-scroll">
        <List divided inverted>
          {map(logs, (data, key) => (
            <LogItem key={key} {...data} />
          ))}
        </List>
      </pre>
    </Scroll>
  </div>
);
