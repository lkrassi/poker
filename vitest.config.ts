import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/__tests__/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html']
		}
	},
	resolve: {
		alias: [
			{ find: /^\$api\/(.*)/, replacement: resolve(__dirname, './src/api/$1') },
			{ find: /^\$components\/(.*)/, replacement: resolve(__dirname, './src/components/$1') },
			{ find: /^\$stores\/(.*)/, replacement: resolve(__dirname, './src/stores/$1') },
			{ find: /^\$lib\/(.*)/, replacement: resolve(__dirname, './src/lib/$1') },
			{ find: /^\$icons\/(.*)/, replacement: resolve(__dirname, './src/assets/icons/$1') }
		]
	}
});
