module.exports = {

    globals: {
        MyGlobal: true
    },
	extends: [
		'@sosocio/eslint-config',
		'plugin:vue/recommended',
		'plugin:json-schema-validator/recommended',
	],
    rules: {	
		'vue/html-indent': [
			'error',
			'tab'
		],
	},

};