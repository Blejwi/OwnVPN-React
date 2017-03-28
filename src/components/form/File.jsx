import React from 'react';
import {Button, Dropdown} from 'semantic-ui-react';
import {remote} from 'electron';
import {isEmpty} from 'lodash';
import Input from './Input';

const clearFile = (change, name) => change(name, '');

const selectFile = (change, name) => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile']
    }, filename => {
        if (!isEmpty(filename)) {
            change(name, filename[0]);
        } else {
            clearFile(change, name);
        }
    });
};

export default ({change, ...props}) => (
    <Input
        {...props}
        type="text"
        readOnly
        action={(
            <Button.Group>
                <Button onClick={() => selectFile(change, props.input.name)} type="button">
                    Select file
                </Button>
                <Dropdown
                    button
                    inline
                    compact
                    text=" "
                    closeOnChange
                    options={[
                        {key: 'clear', icon: 'delete', text: 'Clear'}
                    ]}
                    onChange={() => clearFile(change, props.input.name)}
                />
            </Button.Group>
        )}
    />
);
