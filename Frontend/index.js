module.exports = {

    globals: {
        MyGlobal: true
    },
	extends: [
		'plugin:vue/recommended',
		'@sosocio/eslint-config'
	],
    rules: {	
		'vue/html-indent': [
			'error',
			'tab'
		],
	},

};