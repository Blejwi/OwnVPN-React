import { isObject } from 'lodash';
import moment from 'moment';
import uuid from 'uuid';
import * as LOG from '../constants/logs';

export const add = (inputMessage, level, module = 'APP') => {
    const time = moment().format('YYYY-MM-DD H:mm:ss.SS');
    let message = inputMessage;

    switch (level) {
        case LOG.LEVEL.WARNING:
            console.warn(message);
            break;
        case LOG.LEVEL.ERROR:
            console.error(message);
            break;
        default:
            console.log(message);
    }

    if (isObject(message)) {
        if (message.message) {
            message = message.message;
        } else if (message.command) {
            message = JSON.stringify(message, null, 2);
        } else {
            console.error(message);
        }
    }

    message = message.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');

    return {
        type: LOG.ADD,
        payload: {
            id: uuid.v1(),
            message,
            level,
            module,
            time,
        },
    };
};

export const collapse = () => ({
    type: LOG.TOGGLE_COLLAPSE,
});


export const clear = () => ({
    type: LOG.CLEAR,
});
