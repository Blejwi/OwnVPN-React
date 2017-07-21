import React from 'react';
import { ListItem } from 'semantic-ui-react';


/**
 *  Log item component for logging module
 */
class LogItem extends React.Component {
    /**
     * Sets initial state of log item
     */
    constructor() {
        super();
        /**
         * Component's state
         * @type {{collapsed: boolean}}
         */
        this.state = {
            collapsed: true,
        };

        /**
         * User's click event timestamp
         * @type {number}
         */
        this.clickStart = 0;
    }

    /**
     * Allows to collapse and expand log item
     */
    toggleCollapse() {
        this.setState(prevState => ({ collapsed: !prevState.collapsed }));
    }

    /**
     * Function triggered on mouseDown event.
     * Used to measure length of user left mouse button click
     * @param {Event} event Event object
     */
    mouseDown(event) {
        if (event.button === 0) {
            this.clickStart = event.timeStamp;
        }
    }

    /**
     * Function triggered on mouseUp event.
     * Used to measure length of user left mouse button click.
     * If length of click took more than 150ms, then toggleCollapse function is called
     * @param {Event} event Event object
     */
    mouseUp(event) {
        if (event.button === 0 && event.timeStamp - this.clickStart < 150) {
            this.toggleCollapse();
        }
    }

    /**
     * Basic render function
     * @returns {XML}
     */
    render() {
        return (
          <ListItem
                onMouseDown={e => this.mouseDown(e)}
                onMouseUp={e => this.mouseUp(e)}
                className={this.state.collapsed ? 'collapsed' : ''}
          >
            <span className={`level ${this.props.level}`}>{`[${this.props.level}]`}</span>
            <span className="module">{`[${this.props.module}]`}</span>
            <span className="time">{`[${this.props.time}]`}</span>
            <span className="message">{`: ${this.props.message}`}</span>
          </ListItem>
        );
    }
}

export default LogItem;
