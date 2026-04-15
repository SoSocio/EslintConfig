declare module 'eslint-plugin-vue-pug' {
	import type { Config } from 'eslint/config';

	const pluginVuePug: {
		configs: {
			'flat/recommended': Config;
		};
	};

	export default pluginVuePug;
}
