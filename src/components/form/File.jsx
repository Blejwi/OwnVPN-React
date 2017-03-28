import React from 'react';
import {Button} from 'semantic-ui-react';
import {remote} from 'electron';
import {isEmpty} from 'lodash';
import Input from './Input';

const selectFile = (change, name) => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile']
    }, filename => {
        if (!isEmpty(filename)) {
            change(name, filename[0]);
        } else {
            change(name, '');
        }
    });
};

export default ({change, ...props}) => (
    <Input
        {...props}
        type="text"
        readOnly
        action={(
            <Button onClick={() => selectFile(change, props.input.name)} type="button">
                Select file
            </Button>
        )}
    />
);
