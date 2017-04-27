export const required = (value) => {
    if (!value) {
        return 'Required';
    }
};
export const minLength = min => (value) => {
    if (value && value.length < min) {
        return `Must be ${min} characters or more`;
    }
};
export const minValue = min => (value) => {
    if (value && value < min) {
        return `Must be at least ${min}`;
    }
};
export const maxValue = max => (value) => {
    if (value && value > max) {
        return `Must be lower than ${max}`;
    }
};
export const email = (value) => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return 'Invalid email address';
    }
};
export const ipAddress = (value) => {
    if (value && !/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(value)) {
        return 'Invalid IPv4 address';
    }
};
