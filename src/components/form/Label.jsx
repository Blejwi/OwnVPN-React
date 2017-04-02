import React from 'react';
import {Popup} from 'semantic-ui-react';

export default ({children, help_message}) => {
    const label = <label>{children}</label>;

    if (help_message) {
        return (
            <Popup trigger={label}>
                <Popup.Content>{help_message}</Popup.Content>
            </Popup>
        );
    }

    return label;
}
