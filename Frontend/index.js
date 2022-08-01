module.exports = {

    globals: {
        MyGlobal: true
    },
	extends: [
		'@sosocio/eslint-config',
		'plugin:vue/recommended',
	],
    rules: {
		'vue/html-indent': [
			'error',
			'tab'
		],
		'json-schema-validator/no-invalid': 'error',
	},

};