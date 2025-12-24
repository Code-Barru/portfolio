<script lang="ts">
	import { page } from '$app/stores';
	import { Calendar, Clock, Tag as TagIcon, ArrowLeft } from '@lucide/svelte';
	import type { Post, PostFrontmatter } from '$lib/types';
	import { getLocale } from '$lib/paraglide/runtime';
	import TableOfContents from '$lib/components/TableOfContents.svelte';

	const currentLocale = getLocale();

	const allModules = import.meta.glob<{ metadata: PostFrontmatter; default: any }>(
		'/src/posts/*.md',
		{ eager: true }
	);

	let slug = $derived($page.params.slug);

	let { post, allPosts } = $derived.by(() => {
		let foundPost: (Post & { content: any }) | null = null;
		let posts: Post[] = [];

		for (const [path, module] of Object.entries(allModules)) {
			const filename = path.split('/').pop()?.replace(/\.(md|svx)$/, '').replace(/\.(en|fr)$/, '');

			const localeMatch = path.match(/\.(en|fr)\.md$/);
			const fileLocale = (localeMatch ? localeMatch[1] : 'en') as 'en' | 'fr';

			if (fileLocale !== currentLocale) {
				continue;
			}

			const postData: Post = {
				...module.metadata,
				slug: filename || '',
				readingTime: 0,
				content: module.default,
				locale: fileLocale
			};

			posts.push(postData);

			if (filename === slug) {
				foundPost = postData;
			}
		}

		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return { post: foundPost, allPosts: posts };
	});

	let currentIndex = $derived(allPosts.findIndex((p) => p.slug === slug));
	let prevPost = $derived(currentIndex > 0 ? allPosts[currentIndex - 1] : null);
	let nextPost = $derived(currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null);

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString(currentLocale === 'fr' ? 'fr-FR' : 'en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{post?.title || 'Post not found'}</title>
	{#if post}
		<meta name="description" content={post.description} />
		<meta property="og:title" content={post.title} />
		<meta property="og:description" content={post.description} />
		{#if post.coverImage}
			<meta property="og:image" content={post.coverImage} />
		{/if}
	{/if}
</svelte:head>

{#if post}

	<div class="relative py-8">
		<TableOfContents />

		<div class="mx-auto max-w-3xl">
		<a
			href="/posts"
			class="mb-6 inline-flex items-center gap-2 text-mocha-blue transition-colors hover:text-mocha-sapphire"
		>
			<ArrowLeft size={18} />
			Back to posts
		</a>

		<article>
			<header class="mb-8">
				<h1 class="mb-4 text-4xl font-bold text-mocha-text md:text-5xl">
					{post.title}
				</h1>

				<div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-mocha-subtext0">
					<span class="flex items-center gap-1">
						<Calendar size={16} />
						{formatDate(post.date)}
					</span>

					{#if post.readingTime > 0}
						<span class="flex items-center gap-1">
							<Clock size={16} />
							{post.readingTime} min read
						</span>
					{/if}
				</div>

				{#if post.tags.length > 0}
					<div class="mb-4 flex flex-wrap gap-2">
						<TagIcon size={16} class="mt-1 text-mocha-subtext0" />
						{#each post.tags as tag}
							<a
								href="/posts?tags={tag}"
								class="rounded-full px-3 py-1 text-sm
									transition-colors duration-200 shadow-mocha-crust shadow-sm
									bg-mocha-base text-mocha-text border border-mocha-surface1 border-t-mocha-surface2 hover:border-mocha-blue active:bg-mocha-surface0"
							>
								{tag}
							</a>
						{/each}
					</div>
				{/if}

				{#if post.coverImage}
					<img
						src={post.coverImage}
						alt={post.title}
						class="mb-6 h-64 w-full rounded-lg object-cover"
					/>
				{/if}
			</header>

			<div class="markdown-content mt-8 rounded-lg bg-mocha-crust p-6 md:p-8">
				<post.content />
			</div>
		</article>

		<nav class="mt-12 flex justify-between border-t border-mocha-surface1 pt-8">
			{#if prevPost}
				<a
					href="/posts/{prevPost.slug}"
					class="group flex max-w-[45%] flex-col gap-1 text-left transition-colors"
				>
					<span class="text-xs text-mocha-subtext0">← Previous</span>
					<span
						class="text-sm font-semibold text-mocha-text transition-colors group-hover:text-mocha-blue"
					>
						{prevPost.title}
					</span>
				</a>
			{:else}
				<div></div>
			{/if}

			{#if nextPost}
				<a
					href="/posts/{nextPost.slug}"
					class="group flex max-w-[45%] flex-col gap-1 text-right transition-colors"
				>
					<span class="text-xs text-mocha-subtext0">Next →</span>
					<span
						class="text-sm font-semibold text-mocha-text transition-colors group-hover:text-mocha-blue"
					>
						{nextPost.title}
					</span>
				</a>
			{/if}
		</nav>

		<div class="mt-8 border-t border-mocha-surface1 pt-6">
			<a
				href="/posts"
				class="inline-flex items-center gap-2 text-mocha-blue transition-colors hover:text-mocha-sapphire"
			>
				<ArrowLeft size={18} />
				Back to all posts
			</a>
		</div>
		</div> 
	</div>
{:else}
	<div class="py-8">
		<h1 class="mb-4 text-4xl font-bold text-mocha-red">Post not found</h1>
		<p class="mb-6 text-mocha-subtext1">The post you're looking for doesn't exist.</p>
		<a href="/posts" class="text-mocha-blue hover:underline">Back to posts</a>
	</div>
{/if}
