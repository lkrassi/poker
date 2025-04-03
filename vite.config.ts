import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['clsx', 'devalue']
	},
	resolve: {
		alias: {
			$api: '/src/api',
			$components: '/src/components',
			$stores: '/src/stores',
			$lib: '/src/lib',
			$icons: '/src/assets/icons'
		}
	}
});
