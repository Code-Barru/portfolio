import { loadProjects } from '$lib/utils/content.server';
import type { EntryGenerator } from './$types';

// Generate all project slugs for static prerendering (for all locales)
export const entries: EntryGenerator = async () => {
	// Load projects for both locales to generate all slug entries
	const projectsEn = await loadProjects('en');
	const projectsFr = await loadProjects('fr');
	const allProjects = [...projectsEn, ...projectsFr];

	// Use Set to get unique slugs
	const uniqueSlugs = new Set(allProjects.map((project) => project.slug));
	return Array.from(uniqueSlugs).map((slug) => ({ slug }));
};

export const prerender = true;
