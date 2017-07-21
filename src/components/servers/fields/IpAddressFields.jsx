import React from 'react';
import { Field } from 'redux-form';
import { Button } from 'semantic-ui-react';
import { isFunction, chain } from 'lodash';
import Input from '../../form/Input';
import { ipAddress, required } from '../../../utils/validators';
import LABELS from '../../../constants/labels';

/**
 * Function used for normalizing ip addresses
 * @param {string} value IP address to normalize
 * @returns {string} Normalized IP address
 */
export const normalizeIpAddress = (value) => {
    if (!value) {
        return value;
    }

    const sanitize = value.replace(/[^\d.]/g, '');
    return chain(sanitize)
        .split('.')
        .map((o) => {
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

/**
 * IP address field
 * @param {string} name Name of field
 * @param {function} handleRemove Remove function for IP address
 * @param {string} helpMessage Help message for field
 * @param {bool} disabled If field is disabled
 */
export default ({ name, handleRemove, helpMessage, disabled }) => (
  <div className="field">
    <Field
        name={`${name}.network`}
        component={Input}
        label={LABELS.NETWORK}
        action={
            isFunction(handleRemove) && (
            <Button icon="remove" content="Remove" onClick={handleRemove} />
            )
        }
        placeholder="192.168.10.0"
        required={!disabled}
        disabled={disabled}
        validate={!disabled ? [required, ipAddress] : []}
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
        validate={!disabled ? [required, ipAddress] : []}
        normalize={normalizeIpAddress}
    />
  </div>
);
