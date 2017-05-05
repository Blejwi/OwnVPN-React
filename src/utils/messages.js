import { isString, isObject } from 'lodash';

export const compileMessage = (...params) => {
    const parts = [];

    for (const part of params) {
        if (isString(part)) {
            parts.push(`${part}`);
        } else if (isObject(part)) {
            parts.push(`, ${JSON.stringify(part, null, 2)}`);
        } else {
            parts.push(`, ${part}`);
        }
    }

    return parts.join(', ');
};
