import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/collections';
import { useT } from '../i18n';

export async function GET(context: APIContext) {
	const posts = await getPosts('en');
	const t = useT('en');

	return rss({
		title: 'Antoine Ousselin — Blog',
		description: t('seo_blog_description'),
		site: context.site!,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: post.date,
			link: `/posts/${post.slug}`,
			categories: post.tags
		})),
		customData: '<language>en-us</language>'
	});
}
