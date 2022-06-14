module.exports = {

    globals: {
        MyGlobal: true
    },
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
		'plugin:promise/recommended',
	],
    rules: {
		'spaced-comment': 0,
		'no-console': 0,
		'max-len': ['off', {
			code: 100,
			ignoreComments: true,
		}],
		'no-tabs': 'off',
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'vue/html-indent': ['error', 'tab'],
		eqeqeq: 'off',
		'no-prototype-builtins': 'off',
		'import/no-dynamic-require': 'off',
		'import/no-cycle': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
		'no-param-reassign': 'off',
		'no-underscore-dangle': 'off',
		'class-methods-use-this': 'off',
		'no-mixed-operators': 'off',
		'max-classes-per-file': 'off',
		'prefer-regex-literals': 'off',
		// Note: the typescript rule needs to overrule the regular one
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/indent': ['error', 'tab', { SwitchCase: 1 }],
		//'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/class-name-casing': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		//'@typescript-eslint/no-this-alias': 'off',

		// TODO: Refactor all components to multi-word
		'vue/multi-word-component-names': 'off',

		// no-use-before-define must be disabled because we're using @typescript-eslint/no-use-before-define
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': 'error',

		// no-shadow must be disabled because we're using @typescript-eslint/no-shadow
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',
    },

};