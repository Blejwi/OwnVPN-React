import React from 'react';
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll';
import {map} from 'lodash';
import {Icon, List} from 'semantic-ui-react';

import './Logs.scss';
import LogItem from "./LogItem";

export default ({logs, collapsed, handleCollapse, handleClear}) => (
    <div className="logs-container">
        <Icon onClick={handleCollapse}
              title={collapsed ? 'Expand' : 'Collapse'}
              className="collapse pointer hover-enlarge-1_5"
              name={collapsed ? 'expand' : 'compress'}/>
        <Icon onClick={handleClear}
              title="Clear logs"
              className="collapse pointer hover-enlarge-1_5"
              name="trash outline"/>
        <ReactIScroll
            iScroll={iScroll}
            options={{
                mouseWheel: true,
                scrollbars: true
            }}
            onScrollStart={() => console.log('scroll')}
            onRefresh={(e) => console.log(e)}
        >
            <pre className={(collapsed ? 'collapsed' : '')}>
                <List divided={true} inverted={true}>
                    {map(logs, (data, key) => (
                        <LogItem key={key} {...data} />
                    ))}
                </List>
            </pre>
        </ReactIScroll>
    </div>
);
