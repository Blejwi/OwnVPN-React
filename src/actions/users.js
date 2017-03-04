import * as USER from '../constants/users';

export const add = user => ({
    type: USER.ADD,
    payload: user
});

export const edit = user => ({
    type: USER.EDIT,
    payload: user
});