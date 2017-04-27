module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
    },
    "extends": "airbnb",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "react/prop-types": 0,
        "react/jsx-indent-props": 0,
        "consistent-return": 0,
        "no-console": 0,
        "jsx-a11y/label-has-for": 0
    }
};
