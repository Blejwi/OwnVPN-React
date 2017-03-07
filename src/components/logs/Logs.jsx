import React from 'react';
import {map} from 'lodash';
import {List, ListItem} from 'semantic-ui-react';

import './Logs.scss';

export default ({logs}) => (
    <pre className="logs-container">
        <List divided={true} inverted={true}>
                {map([...logs].reverse(), ({message, level, module, time}, key) => (
                    <ListItem key={key}>
                        <span className={`level ${level}`}>{`[${level}]`}</span>
                        <span className="module">{`[${module}]`}</span>
                        <span className="time">{`[${time}]`}</span>
                        <span className="message">{`: ${message}`}</span>
                    </ListItem>
                ))}
        </List>
    </pre>
);
