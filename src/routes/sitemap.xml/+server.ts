import { loadPosts, loadProjects } from '$lib/utils/content.server';
import type { RequestHandler } from './$types';

export const prerender = true;

const site = 'https://antoineousselin.fr';

export const GET: RequestHandler = async () => {
	const postsEn = await loadPosts('en');
	const postsFr = await loadPosts('fr');
	const projectsEn = await loadProjects('en');
	const projectsFr = await loadProjects('fr');

	const pages = [
		{ url: '', changefreq: 'daily', priority: 1.0 },
		{ url: 'posts', changefreq: 'daily', priority: 0.8 },
		{ url: 'projects', changefreq: 'weekly', priority: 0.8 },
		{ url: 'contact', changefreq: 'monthly', priority: 0.6 }
	];

	const locales = ['en', 'fr'];
	const localePages = locales.flatMap((locale) => [
		{ url: `${locale}`, changefreq: 'daily', priority: 1.0 },
		{ url: `${locale}/posts`, changefreq: 'daily', priority: 0.8 },
		{ url: `${locale}/projects`, changefreq: 'weekly', priority: 0.8 },
		{ url: `${locale}/contact`, changefreq: 'monthly', priority: 0.6 }
	]);

	const postPages = [
		...postsEn.map((post) => ({
			url: `en/posts/${post.slug}`,
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: post.date
		})),
		...postsFr.map((post) => ({
			url: `fr/posts/${post.slug}`,
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: post.date
		}))
	];

	const projectPages = [
		...projectsEn.map((project) => ({
			url: `en/projects/${project.slug}`,
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: project.date
		})),
		...projectsFr.map((project) => ({
			url: `fr/projects/${project.slug}`,
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: project.date
		}))
	];

	const allPages = [...pages, ...localePages, ...postPages, ...projectPages];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `	<url>
		<loc>${site}/${page.url}</loc>
		${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
