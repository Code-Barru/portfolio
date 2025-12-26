import { loadProjects, loadPosts } from '$lib/utils/content.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Charger les deux locales (filtrage client pour switch instantané)
	const projectsEn = await loadProjects('en');
	const projectsFr = await loadProjects('fr');
	const postsEn = await loadPosts('en');
	const postsFr = await loadPosts('fr');

	// Exclure le champ content pour la sérialisation
	const projects = [...projectsEn, ...projectsFr].map(({ content, ...p }) => p);
	const posts = [...postsEn, ...postsFr].map(({ content, ...p }) => p);

	return { projects, posts };
};
