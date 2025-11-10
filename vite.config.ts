import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 2014,
	},
	plugins: [sveltekit()],
	resolve: {
		alias: {
			"@components": resolve(__dirname, 'src/lib/components/'),
		},
	},
});
