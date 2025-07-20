// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
    adapter: vercel({ functionPerRoute: true }),
    vite: {
        assetsInclude: ['**/*.svg']
    },
    build: {
        inlineStylesheets: 'auto'
    }
});
