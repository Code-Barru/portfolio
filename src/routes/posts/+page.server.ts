import { loadPosts, extractTags } from '$lib/utils/content.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Load all posts (filtering by locale happens client-side)
	const postsEn = await loadPosts('en');
	const postsFr = await loadPosts('fr');
	const allPosts = [...postsEn, ...postsFr];

	const tags = extractTags(allPosts);

	// Exclude content field for serialization (not needed for list page)
	const posts = allPosts.map(({ content, ...post }) => post);

	return {
		posts,
		tags
	};
};
