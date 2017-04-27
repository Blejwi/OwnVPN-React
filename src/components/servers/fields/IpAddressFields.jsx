import React from 'react';
import { Field } from 'redux-form';
import { Button } from 'semantic-ui-react';
import { isFunction } from 'lodash';
import Input from '../../form/Input';
import { ipAddress, required } from '../../../utils/validators';
import LABELS from '../../../constants/labels';

const normalizeIpAddress = value => {
    if (!value) {
        return value;
    }

    const sanitize = value.replace(/[^\d.]/g, '');
    return chain(sanitize)
        .split('.')
        .map(o => {
            if (o > 255) {
                if (o > 1000) {
                    return o.slice(0, 3);
                }

                return o.slice(0, 2);
            }

            return o;
        })
        .take(4)
        .join('.')
        .value();
};

export default ({ name, handleRemove, helpMessage, disabled }) => (
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
            validate={[required, ipAddress]}
            helpMessage={helpMessage}
            normalize={normalizeIpAddress}
    />
        <Field
            name={`${name}.mask`}
            component={Input}
            label={LABELS.MASK}
            placeholder="255.255.255.0"
            required={!disabled}
            disabled={disabled}
            validate={[required, ipAddress]}
            normalize={normalizeIpAddress}
        />
    </div>
);
