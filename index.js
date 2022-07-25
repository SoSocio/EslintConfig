module.exports = {

    globals: {
        MyGlobal: true
    },
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
		'plugin:promise/recommended',
		'plugin:json-schema-validator/recommended',
	],
    rules: {
		// Reason: Create some consistency if the markup of inline comments
		'spaced-comment': [
			'warn',
			'always'
		],
		
		// Reason: Console log messages can be very helpful in debugging and monitoring
		'no-console': 0,
		
		// Reason: We use TABS for indentation
		'no-tabs': 'off',
		indent: [
			'error',
			'tab',
			{ SwitchCase: 1 }
		],
		'@typescript-eslint/indent': [
			'error',
			'tab',
			{ SwitchCase: 1 }
		],
		
		// Reason: In complex applications you sometimes have cycle references. This is something that may be looked into in the future, but right now is not a priority.
		'import/no-cycle': 'off',
		
		// Reason: Developers don't need to use file extensions when importing files, and we do not control external packages so ignore those
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
		'function-call-argument-newline': ['error', 'always'],
		
		// Reason: Why shouldn't you be able to have a dangling underscore in your variable name?
		'no-underscore-dangle': 'off',
		
		// Reason: Class methods that don't use this can be turned to static methods, but it required code refactoring, so we won't enforce this right now
		'class-methods-use-this': 'warn',

		// Reason: no-unused-vars must be disabled because we're using @typescript-eslint/no-unused-vars
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		
		// Reason: we allow @ts-ignore to be used
		'@typescript-eslint/ban-ts-comment': 'off',

		// Reason: no-use-before-define must be disabled because we're using @typescript-eslint/no-use-before-define
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': 'error',

		// Reason: no-shadow must be disabled because we're using @typescript-eslint/no-shadow
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',
	},

};