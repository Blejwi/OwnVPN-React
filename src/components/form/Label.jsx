import React from 'react';
import { Popup } from 'semantic-ui-react';

/**
 * Displays input's label
 * @param {node} children Label contents
 * @param {string|custom} helpMessage Message with useful information for user
 */
export default ({ children, helpMessage }) => {
    const label = <label>{children}</label>;

    if (helpMessage) {
        return (
          <Popup trigger={label}>
            <Popup.Content>{helpMessage}</Popup.Content>
          </Popup>
        );
    }

    return label;
};
