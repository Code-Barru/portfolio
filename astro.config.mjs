// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkAlerts } from './src/lib/remark-alerts.js';

export default defineConfig({
	site: 'https://antoineousselin.fr',
	output: 'static',
	trailingSlash: 'never',
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'fr'],
		routing: { prefixDefaultLocale: false }
	},
	integrations: [
		svelte(),
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: { en: 'en-US', fr: 'fr-FR' }
			}
		})
	],
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: { theme: 'catppuccin-mocha' },
		remarkPlugins: [remarkAlerts]
	},
	vite: {
		plugins: [tailwindcss()],
		server: {
			proxy: {
				'/api': 'http://localhost:8000'
			}
		}
	}
});
