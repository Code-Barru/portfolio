import { loadProjects, extractTags } from '$lib/utils/content.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Load all projects (filtering by locale happens client-side)
	const projectsEn = await loadProjects('en');
	const projectsFr = await loadProjects('fr');
	const allProjects = [...projectsEn, ...projectsFr];

	const tags = extractTags(allProjects);

	// Exclude content field for serialization (not needed for list page)
	const projects = allProjects.map(({ content, ...project }) => project);

	return {
		projects,
		tags
	};
};
