import type { Post, Project } from '$lib/types';

/**
 * Filter items by search query (title, description, tags)
 */
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

/**
 * Filter items by tags (must include ALL specified tags)
 */
export function filterByTags<T extends Post | Project>(items: T[], tags: string[]): T[] {
	if (tags.length === 0) return items;

	return items.filter((item) => tags.every((tag) => item.tags.includes(tag)));
}

/**
 * Paginate items
 */
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
