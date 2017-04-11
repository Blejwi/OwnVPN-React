import React from "react";
import {ListItem} from "semantic-ui-react";


class LogItem extends React.Component {
    constructor() {
        super();
        this.state = {
            collapsed: true
        };
        this.clickStart = 0;
    }

    render() {
        return (
            <ListItem
                onMouseDown={(e) => this.mouseDown(e)}
                onMouseUp={(e) => this.mouseUp(e)}
                className={this.state.collapsed ? 'collapsed': ''}>
                <span className={`level ${this.props.level}`}>{`[${this.props.level}]`}</span>
                <span className="module">{`[${this.props.module}]`}</span>
                <span className="time">{`[${this.props.time}]`}</span>
                <span className="message">{`: ${this.props.message}`}</span>
            </ListItem>
        );
    }

    toggleCollapse() {
        this.setState((prevState) => ({collapsed: !prevState.collapsed}));
    }

    mouseDown(event) {
        if (event.button === 0) {
            this.clickStart = event.timeStamp;
        }
    }

    mouseUp(event) {
        if (event.button === 0 && event.timeStamp - this.clickStart < 150) {
            this.toggleCollapse();
        }
    }
}

export default LogItem;
