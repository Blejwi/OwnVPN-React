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

const saveFile = (change, name) => {
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), filename => {
        if (filename) {
            change(name, filename);
        } else {
            clearFile(change, name);
        }
    });
};

const filePicker = (change, name, save) => {
    if (save) {
        saveFile(change, name);
    } else {
        selectFile(change, name);
    }
};

export default ({change, save, ...props}) => (
    <Input
        {...props}
        type="text"
        readOnly
        action={(
            <Button.Group>
                <Button onClick={() => filePicker(change, props.input.name, save)} type="button">
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
