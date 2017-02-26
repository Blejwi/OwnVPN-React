import {isObject} from 'lodash';
import moment from 'moment';
import * as LOG from '../constants/logs';

export const add = (message, level, module='APP') => {
    let time = moment().format('YYYY-MM-DD H:mm:ss.SS');

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
        }
    }

    return {
        type: LOG.ADD,
        payload: {message, level, module, time}
    };
};