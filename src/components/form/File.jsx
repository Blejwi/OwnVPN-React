import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import { remote } from 'electron';
import { isEmpty } from 'lodash';
import Input from './Input';

/**
 * Clears file input
 * @param {function} change Dispatches change action
 * @param {string} name Input's name
 */
const clearFile = (change, name) => change(name, '');

/**
 * Opens dialog for selecting existing file
 * @param {function} change Dispatches change action
 * @param {string} name Input's name
 */
const selectFile = (change, name) => {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile'],
    }, (filename) => {
        if (!isEmpty(filename)) {
            change(name, filename[0]);
        } else {
            clearFile(change, name);
        }
    });
};

/**
 * Opens dialog for selecting file's destination
 * @param {function} change Dispatches change action
 * @param {string} name Input's name
 */
const saveFile = (change, name) => {
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), (filename) => {
        if (filename) {
            change(name, filename);
        } else {
            clearFile(change, name);
        }
    });
};

/**
 * Opens dialog for picking file
 * @param {function} change Dispatches change action
 * @param {string} name Input's name
 * @param {bool} save Set if selected file needs to be created
 */
const filePicker = (change, name, save) => {
    if (save) {
        saveFile(change, name);
    } else {
        selectFile(change, name);
    }
};

/**
 * Displays file input
 * @param {function} change Dispatches change action
 * @param {bool} save Set if selected file needs to be created
 * @param {object} props Other input's attributes
 */
export default ({ change, save, ...props }) => (
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
                        { key: 'clear', icon: 'delete', text: 'Clear' },
                    ]}
                    onChange={() => clearFile(change, props.input.name)}
            />
          </Button.Group>
        )}
  />
);
