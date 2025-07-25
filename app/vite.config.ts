import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	preview: {
		port: 3000,
		host: true,
		strictPort: true
	},
	server: {
		port: 3000,
		host: true,
		strictPort: true
	}
});
