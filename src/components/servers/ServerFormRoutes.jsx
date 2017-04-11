import React from 'react';
import {Field} from 'redux-form';
import {Button} from 'semantic-ui-react';
import Input from '../form/Input';
import {required} from '../../utils/validators';

export default ({name, handleRemove}) => (
    <div>
        <Field
            name={`${name}.network`}
            component={Input}
            label="Network"
            action={
                <Button
                    icon="remove"
                    content="Remove"
                    onClick={handleRemove}
                />
            }
            placeholder="192.168.10.0"
            required
            validate={[required]}
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
