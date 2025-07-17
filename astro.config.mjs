// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel'; // モジュールが見つからないためコメントアウト

export default defineConfig({
	output: 'server',
	adapter: vercel(),
});

