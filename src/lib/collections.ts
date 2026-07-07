import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

const WORDS_PER_MINUTE = 200;

export function readingTime(body: string): number {
	const words = body.trim().split(/\s+/).length;
	return Math.ceil(words / WORDS_PER_MINUTE);
}

/** glob loader ids look like "welcome.en" / "icarus-old.fr" */
export function parseId(id: string): { slug: string; locale: Locale } {
	const match = id.match(/^(.+)\.(en|fr)$/);
	if (!match) throw new Error(`Content id "${id}" does not match "{slug}.{locale}"`);
	return { slug: match[1], locale: match[2] as Locale };
}

export type PostItem = CollectionEntry<'posts'>['data'] & {
	entry: CollectionEntry<'posts'>;
	slug: string;
	locale: Locale;
	readingTime: number;
};

export type ProjectItem = CollectionEntry<'projects'>['data'] & {
	entry: CollectionEntry<'projects'>;
	slug: string;
	locale: Locale;
	readingTime: number;
};

export async function getPosts(locale: Locale): Promise<PostItem[]> {
	const entries = await getCollection('posts', ({ data }) => data.published !== false);
	return entries
		.map((entry) => ({
			entry,
			...entry.data,
			...parseId(entry.id),
			readingTime: readingTime(entry.body ?? '')
		}))
		.filter((post) => post.locale === locale)
		.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getProjects(locale: Locale): Promise<ProjectItem[]> {
	const entries = await getCollection('projects', ({ data }) => data.published !== false);
	return entries
		.map((entry) => ({
			entry,
			...entry.data,
			...parseId(entry.id),
			readingTime: readingTime(entry.body ?? '')
		}))
		.filter((project) => project.locale === locale)
		.sort((a, b) => b.date.getTime() - a.date.getTime());
}

import type { PostMeta, ProjectMeta } from './types';

/** Strip the collection entry down to what islands can receive as JSON props. */
export function toPostMeta(post: PostItem | ProjectItem): PostMeta {
	return {
		slug: post.slug,
		locale: post.locale,
		title: post.title,
		date: post.date.toISOString(),
		description: post.description,
		tags: post.tags,
		readingTime: post.readingTime
	};
}

export function toProjectMeta(project: ProjectItem): ProjectMeta {
	return {
		...toPostMeta(project),
		featured: project.featured,
		github: project.github,
		demoUrl: project.demoUrl,
		status: project.status
	};
}

export function extractTags(items: { tags: string[] }[]): string[] {
	const tags = new Set<string>();
	for (const item of items) {
		for (const tag of item.tags) tags.add(tag);
	}
	return [...tags].sort();
}
