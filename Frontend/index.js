module.exports = {

    globals: {
        MyGlobal: true
    },
	extends: [
		'@sosocio/eslint-config',
		'plugin:vue/vue3-recommended',
		'plugin:vue-pug/vue3-recommended',
	],
    rules: {
		'vue/html-indent': [
			'error',
			'tab'
		],
		'json-schema-validator/no-invalid': 'error',
	},

};