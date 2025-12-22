import { loadPosts } from '$lib/utils/content.server';
import type { EntryGenerator } from './$types';

// Generate all post slugs for static prerendering (for all locales)
export const entries: EntryGenerator = async () => {
	// Load posts for both locales to generate all slug entries
	const postsEn = await loadPosts('en');
	const postsFr = await loadPosts('fr');
	const allPosts = [...postsEn, ...postsFr];

	// Use Set to get unique slugs
	const uniqueSlugs = new Set(allPosts.map((post) => post.slug));
	return Array.from(uniqueSlugs).map((slug) => ({ slug }));
};

export const prerender = true;
