module.exports = {

    globals: {
        MyGlobal: true
    },
	extends: [
        '@sosocio/eslint-config',
    ],
    rules: {
        'json-schema-validator/no-invalid': 'error',
    },

};