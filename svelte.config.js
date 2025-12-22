import { escapeSvelte, mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { getSingletonHighlighter } from 'shiki';
import { remarkAlerts } from './src/lib/remark-alerts.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.svx'],
			remarkPlugins: [remarkAlerts],
			highlight: {
        highlighter: async (code, lang = 'text') => {
          const highlighter = await getSingletonHighlighter({
            themes: ['catppuccin-mocha', 'catppuccin-latte'],
            langs: ['javascript', 'rust', 'sh', 'shell', 'toml', 'cpp']
          });
          const html = escapeSvelte(
            highlighter.codeToHtml(code, {
              lang,
              theme: 'catppuccin-mocha'
            })
          );
          return `{@html \`${html}\`}`;
        }
			}
		})
	],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			handleHttpError: 'warn',
			entries: ['*']
		}
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
