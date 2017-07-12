import { SubmissionError } from 'redux-form';

/**
 * Checks if required field is not empty
 * @param value
 * @returns {string}
 */
export const required = (value) => {
    if (!value) {
        return 'Required';
    }
};

/**
 * Checks if minimal value length is fulfilled
 * @param {integer} min Minimal number of characters in string
 */
export const minLength = min => (value) => {
    if (value && value.length < min) {
        return `Must be ${min} characters or more`;
    }
};

/**
 * Checks if value is greater than minimum
 * @param {integer} min Minimum
 */
export const minValue = min => (value) => {
    if (value && value < min) {
        return `Must be at least ${min}`;
    }
};

/**
 * Checks if value is smaller than maximum
 * @param {integer} max Maximum
 */
export const maxValue = max => (value) => {
    if (value && value > max) {
        return `Must be lower than ${max}`;
    }
};

/**
 * Checks if value is proper e-mail address
 * @param {string} value
 * @returns {string} Error message
 */
export const email = (value) => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return 'Invalid email address';
    }
};

/**
 * Checks if value is proper IPv4 address
 * @param {string} value
 * @returns {string}
 */
export const ipAddress = (value) => {
    if (value && !/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(value)) {
        return 'Invalid IPv4 address';
    }
};

/**
 * Checks if user's settings are valid
 * @param {object} user
 */
export const validateUser = (user) => {
    if (user.config.httpProxyServer && !user.config.httpProxyPort) {
        throw new SubmissionError({
            config: {
                httpProxyPort: 'Http proxy port must be set',
            },
        });
    }
    if (!user.config.httpProxyServer && user.config.httpProxyPort) {
        throw new SubmissionError({
            config: {
                httpProxyServer: 'Http proxy server must be set',
            },
        });
    }
};

/**
 * Checks if server's settings are valid
 * @param server
 */
export const validateServer = (server) => {
    if (server.config.server_mode === 'server') {
        if (server.config.explicit_exit_notify === '1') {
            throw new SubmissionError({
                config: {
                    explicit_exit_notify: 'Explicit-exit-notify cannot be used with mode server',
                },
            });
        }
    }
};
