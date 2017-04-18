import React from 'react';
import {Popup} from 'semantic-ui-react';

export default ({children, helpMessage}) => {
    const label = <label>{children}</label>;

    if (helpMessage) {
        return (
            <Popup trigger={label}>
                <Popup.Content>{helpMessage}</Popup.Content>
            </Popup>
        );
    }

    return label;
}
