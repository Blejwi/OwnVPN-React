import React from 'react';
import {map} from 'lodash';
import {Icon, List, ListItem} from 'semantic-ui-react';

import './Logs.scss';

export default ({logs, collapsed, handleCollapse, handleClear}) => (
    <div className="logs-container">
        <Icon onClick={handleCollapse} title={collapsed ? 'Expand' : 'Collapse'} className="collapse pointer hover-enlarge-1_5" name={collapsed ? 'expand' : 'compress'} />
        <Icon onClick={handleClear} title="Clear logs" className="collapse pointer hover-enlarge-1_5" name="trash outline" />
        <pre className={(collapsed ? 'collapsed': '')}>
            <List divided={true} inverted={true}>
                    {map(logs, ({message, level, module, time}, key) => (
                        <ListItem key={key}>
                            <span className={`level ${level}`}>{`[${level}]`}</span>
                            <span className="module">{`[${module}]`}</span>
                            <span className="time">{`[${time}]`}</span>
                            <span className="message">{`: ${message}`}</span>
                        </ListItem>
                    ))}
            </List>
        </pre>
    </div>
);
