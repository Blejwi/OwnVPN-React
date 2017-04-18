import React from 'react';
import {Field} from 'redux-form';
import {Button} from 'semantic-ui-react';
import {isFunction} from 'lodash';
import Input from '../../form/Input';
import {required} from '../../../utils/validators';

export default ({name, handleRemove, helpMessage}) => (
    <div className="field">
        <Field
            name={`${name}.network`}
            component={Input}
            label="Network"
            action={
                isFunction(handleRemove) && (
                    <Button
                        icon="remove"
                        content="Remove"
                        onClick={handleRemove}
                    />
                )
            }
            placeholder="192.168.10.0"
            required
            validate={[required]}
            helpMessage={helpMessage}
        />
        <Field
            name={`${name}.mask`}
            component={Input}
            label="Mask"
            placeholder="255.255.255.0"
            required
            validate={[required]}
        />
    </div>
);
