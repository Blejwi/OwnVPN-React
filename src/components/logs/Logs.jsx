import React from 'react';
import {map} from 'lodash';
import {Icon, List, ListItem} from 'semantic-ui-react';

import './Logs.scss';
import LogItem from "./LogItem";


class Logs extends React.Component {
    render() {
        return (
            <div className="logs-container">
                <Icon onClick={this.props.handleCollapse}
                      title={this.props.collapsed ? 'Expand' : 'Collapse'}
                      className="collapse pointer hover-enlarge-1_5"
                      name={this.props.collapsed ? 'expand' : 'compress'}/>
                <Icon
                    onClick={this.props.handleClear}
                    title="Clear logs"
                    className="collapse pointer hover-enlarge-1_5"
                    name="trash outline"/>

                <pre className={(this.props.collapsed ? 'collapsed' : '')}>
                        <List divided={true} inverted={true}>
                            {map(this.props.logs, (data, key) => (
                                <LogItem key={key} {...data} />
                            ))}
                        </List>
                    </pre>
                </div>
        );
    }
}

export default Logs;
