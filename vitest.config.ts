import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],

	resolve: {
		alias: {
			'@': fileURLToPath(
				new URL('./src', import.meta.url)
			),
		},
	},

	test: {
		// Use a browser-like DOM environment for React component tests.
		environment: 'jsdom',

		// Make Vitest functions such as describe, it and expect
		// available without importing them into every test file.
		globals: true,

		// Load shared DOM assertions before every test file.
		setupFiles: ['./src/test/setup.ts'],

		// Restore mocked functions after every test to prevent
		// one test from affecting another.
		restoreMocks: true,
	},
});