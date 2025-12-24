<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
  import { m } from '$lib/paraglide/messages';
	import { browser } from '$app/environment';
	import { searchItems, filterByTags, paginateItems } from '$lib/utils/content';
	import { Search, Tag as TagIcon } from '@lucide/svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import { getLocale } from '$lib/paraglide/runtime';

	const ITEMS_PER_PAGE = 10;

	let { data } = $props();

	const currentLocale = getLocale();

	let searchQuery = $state('');

	$effect(() => {
		if (browser) {
			searchQuery = '';
		}
	});

	let selectedTags = $derived(
		browser ? $page.url.searchParams.get('tags')?.split(',').filter(Boolean) || [] : []
	);
	let currentPage = $derived(browser ? Number($page.url.searchParams.get('page')) || 1 : 1);

	let filteredPosts = $derived.by(() => {
		let result = (data.posts || []).filter((post) => post.locale === currentLocale);
		result = searchItems(result, searchQuery);
		result = filterByTags(result, selectedTags);
		return result;
	});

	let paginatedData = $derived(paginateItems(filteredPosts, currentPage, ITEMS_PER_PAGE));

	function updateParams(updates: Record<string, string | null>) {
		if (!$page.url) return;
		const params = new URLSearchParams($page.url.searchParams);

		for (const [key, value] of Object.entries(updates)) {
			if (value === null || value === '') {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		}

		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function toggleTag(tag: string) {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];

		searchQuery = '';

		updateParams({
			tags: newTags.length > 0 ? newTags.join(',') : null,
			page: null
		});
	}
</script>

<svelte:head>
	<title>Blog Posts</title>
	<meta name="description" content="Browse all blog posts" />
</svelte:head>

<div class="py-8">
	<h1 class="mb-8 text-4xl font-bold text-mocha-blue">{m.blog_name()}</h1>

	<!-- Search Bar -->
	<div class="mb-6">
		<div class="relative">
			<Search
				class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mocha-subtext0"
				size={20}
			/>
			<input
				type="text"
				placeholder={m.blog_search()}
				bind:value={searchQuery}
				class="w-full rounded-md border border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base py-2 pl-10 pr-4 shadow-mocha-crust shadow-sm
               text-mocha-text placeholder-mocha-subtext0
               focus:outline-none focus:border-mocha-blue transition-colors duration-200"
			/>
		</div>
	</div>

	<!-- Tag Filter -->
	{#if data.tags && data.tags.length > 0}
		<div class="mb-8">
			<div class="mb-3 flex items-center gap-2">
				<TagIcon size={18} class="text-mocha-subtext0" />
				<span class="text-sm text-mocha-subtext0">{m.blog_filter_by_tags()}</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each data.tags as tag}
					<button
						onclick={() => toggleTag(tag)}
						class="px-3 py-1 text-sm border rounded-full shadow-mocha-crust shadow-sm transition-colors duration-200
                   {selectedTags.includes(tag)
							? 'bg-mocha-blue text-mocha-base border-mocha-sapphire border-t-mocha-sky'
							: 'bg-mocha-base text-mocha-text border-mocha-surface1 border-t-mocha-surface2 hover:border-mocha-blue active:bg-mocha-surface0'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Results Count -->
	<div class="mb-4 text-sm text-mocha-subtext0">
		{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
	</div>

	<!-- Posts List -->
	<div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
		{#each paginatedData.items as post}
			<PostCard {post} />
		{/each}
	</div>

	<!-- Pagination -->
	{#if paginatedData.totalPages > 1}
		<div class="flex justify-center gap-2">
			{#each Array(paginatedData.totalPages) as _, i}
				<button
					onclick={() => updateParams({ page: (i + 1).toString() })}
					class="px-4 py-2 border rounded-md shadow-mocha-crust shadow-sm transition-colors duration-200
                 {currentPage === i + 1
						? 'bg-mocha-blue text-mocha-base border-mocha-sapphire border-t-mocha-sky'
						: 'bg-mocha-base text-mocha-text border-mocha-surface1 border-t-mocha-surface2 hover:border-mocha-blue active:bg-mocha-surface0'}"
				>
					{i + 1}
				</button>
			{/each}
		</div>
	{/if}
</div>
