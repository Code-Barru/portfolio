import type { Post, PostFrontmatter, Project, ProjectFrontmatter } from '$lib/types';
export function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const wordCount = content.trim().split(/\s+/).length;
	return Math.ceil(wordCount / wordsPerMinute);
}

export function getSlugFromPath(path: string): string {
	const parts = path.split('/');
	const filename = parts[parts.length - 1];
	return filename.replace(/\.(md|svx)$/, '').replace(/\.(en|fr)$/, '');
}

export function getLocaleFromPath(path: string): 'en' | 'fr' | undefined {
	const match = path.match(/\.(en|fr)\.(md|svx)$/);
	return match ? (match[1] as 'en' | 'fr') : undefined;
}

export async function loadPosts(locale?: string): Promise<Post[]> {
	const postFiles = import.meta.glob<{
		metadata: PostFrontmatter;
		default: any;
	}>('/src/posts/*.md', { eager: true });

	const posts: Post[] = [];

	for (const [path, module] of Object.entries(postFiles)) {
		const slug = getSlugFromPath(path);
		const postLocale = getLocaleFromPath(path);

		if (locale && postLocale && postLocale !== locale) {
			continue;
		}

		if (module.metadata.published === false) {
			continue;
		}

		const post: Post = {
			...module.metadata,
			slug,
			readingTime: 0, 
			content: module.default,
			locale: postLocale
		};

		posts.push(post);
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function loadPost(slug: string, locale?: string): Promise<Post | null> {
	const posts = await loadPosts(locale);
	return posts.find((p) => p.slug === slug) || null;
}

export async function loadProjects(locale?: string): Promise<Project[]> {
	const projectFiles = import.meta.glob<{
		metadata: ProjectFrontmatter;
		default: any;
	}>('/src/projects/*.md', { eager: true });

	const projects: Project[] = [];

	for (const [path, module] of Object.entries(projectFiles)) {
		const slug = getSlugFromPath(path);
		const projectLocale = getLocaleFromPath(path);

		if (locale && projectLocale && projectLocale !== locale) {
			continue;
		}

		const project: Project = {
			...module.metadata,
			slug,
			readingTime: 0,
			content: module.default,
			locale: projectLocale
		};

		projects.push(project);
	}

	return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function loadProject(slug: string, locale?: string): Promise<Project | null> {
	const projects = await loadProjects(locale);
	return projects.find((p) => p.slug === slug) || null;
}

export function extractTags(items: (Post | Project)[]): string[] {
	const tagSet = new Set<string>();
	items.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));
	return Array.from(tagSet).sort();
}

export function searchItems<T extends Post | Project>(items: T[], query: string): T[] {
	if (!query.trim()) return items;

	const lowerQuery = query.toLowerCase();
	return items.filter((item) => {
		return (
			item.title.toLowerCase().includes(lowerQuery) ||
			item.description.toLowerCase().includes(lowerQuery) ||
			item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
		);
	});
}

export function filterByTags<T extends Post | Project>(items: T[], tags: string[]): T[] {
	if (tags.length === 0) return items;

	return items.filter((item) => tags.every((tag) => item.tags.includes(tag)));
}

export function paginateItems<T>(
	items: T[],
	page: number,
	itemsPerPage: number
): { items: T[]; totalPages: number } {
	const totalPages = Math.ceil(items.length / itemsPerPage);
	const start = (page - 1) * itemsPerPage;
	const end = start + itemsPerPage;

	return {
		items: items.slice(start, end),
		totalPages
	};
}
