// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel'; // モジュールが見つからないためコメントアウト
import react from '@astrojs/react';

export default defineConfig({
	output: 'server',
	adapter: vercel(),
	integrations: [react()],
});

