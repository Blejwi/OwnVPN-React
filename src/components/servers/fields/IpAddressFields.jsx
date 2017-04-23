import React from 'react';
import {Field} from 'redux-form';
import {Button} from 'semantic-ui-react';
import {isFunction} from 'lodash';
import Input from '../../form/Input';
import {required} from '../../../utils/validators';
import LABELS from '../../../constants/labels';

export default ({name, handleRemove, helpMessage, disabled}) => (
    <div className="field">
        <Field
            name={`${name}.network`}
            component={Input}
            label={LABELS.NETWORK}
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
            required={!disabled}
            disabled={disabled}
            validate={!disabled && [required]}
            helpMessage={helpMessage}
        />
        <Field
            name={`${name}.mask`}
            component={Input}
            label={LABELS.MASK}
            placeholder="255.255.255.0"
            required={!disabled}
            disabled={disabled}
            validate={!disabled && [required]}
        />
    </div>
);
