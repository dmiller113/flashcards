import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			assets: 'build',
			fallback: undefined,
			pages: 'build',
			paths: {
				base: process.argv.includes('dev') ? '' : 'flashcards',
			},
			precompress: false,
			strict: true,
		}),
	},
};

export default config;
