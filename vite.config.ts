import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit()],

    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },
    server: {
        proxy: {
          '/api': {
            target: 'http://localhost:5256',
            changeOrigin: true,
            secure: false
          }
        }
      }
});



