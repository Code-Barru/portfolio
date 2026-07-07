import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseSchema = z.object({
	title: z.string(),
	date: z.coerce.date(),
	description: z.string(),
	tags: z.array(z.string()).default([]),
	published: z.boolean().default(true),
	coverImage: z.string().optional()
});

// Default generateId slugifies away the ".en"/".fr" suffix — keep the raw filename instead.
const keepLocaleSuffix = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const posts = defineCollection({
	loader: glob({
		pattern: '*.{en,fr}.md',
		base: './src/content/posts',
		generateId: keepLocaleSuffix
	}),
	schema: baseSchema
});

const projects = defineCollection({
	loader: glob({
		pattern: '*.{en,fr}.md',
		base: './src/content/projects',
		generateId: keepLocaleSuffix
	}),
	schema: baseSchema.extend({
		featured: z.boolean().default(false),
		github: z.string().url().optional(),
		demoUrl: z.string().url().optional(),
		status: z.enum(['completed', 'in-progress', 'archived']).optional()
	})
});

export const collections = { posts, projects };
