// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
    adapter: vercel({}),
    vite: {
        assetsInclude: ['**/*.svg']
    },
    build: {
        inlineStylesheets: 'auto'
    }
});
