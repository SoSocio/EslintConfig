module.exports = {

    globals: {
        MyGlobal: true
    },
	extends: [
        '@sosocio/eslint-config',
		'plugin:json-schema-validator/recommended',
    ],
    rules: {
        'json-schema-validator/no-invalid': 'error',
    },

};