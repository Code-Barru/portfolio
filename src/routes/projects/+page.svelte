<script lang="ts">
	import { page } from '$app/stores';
  import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { searchItems, filterByTags, paginateItems } from '$lib/utils/content';
	import { Search, Tag as TagIcon, Star } from '@lucide/svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { getLocale } from '$lib/paraglide/runtime';

	const ITEMS_PER_PAGE = 9;

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
	let showFeaturedOnly = $derived(browser ? $page.url.searchParams.get('featured') === 'true' : false);

	let filteredProjects = $derived.by(() => {
		let result = (data.projects || []).filter((project) => project.locale === currentLocale);
		if (showFeaturedOnly) {
			result = result.filter((p) => p.featured);
		}
		result = searchItems(result, searchQuery);
		result = filterByTags(result, selectedTags);
		return result;
	});

	let paginatedData = $derived(paginateItems(filteredProjects, currentPage, ITEMS_PER_PAGE));

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
	<title>projects</title>
	<meta name="description" content="Browse my projects" />
</svelte:head>

<div class="py-8">
	<h1 class="mb-8 text-4xl font-bold text-mocha-blue">{m.projects_name()}</h1>

	<!-- Search & Filters -->
	<div class="mb-6 space-y-4">
		<div class="relative">
			<Search
				class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mocha-subtext0"
				size={20}
			/>
			<input
				type="text"
				placeholder={m.projects_search()}
				bind:value={searchQuery}
				class="w-full rounded-lg border border-mocha-surface1 bg-mocha-surface0 py-2 pl-10 pr-4
               text-mocha-text placeholder-mocha-subtext0
               focus:outline-none focus:ring-2 focus:ring-mocha-blue"
			/>
		</div>

		<!-- Featured Toggle -->
		<div class="flex items-center gap-3">
			<button
				onclick={() =>
					updateParams({ featured: showFeaturedOnly ? null : 'true', page: null })}
				class="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-200
               {showFeaturedOnly
					? 'bg-mocha-yellow text-mocha-base'
					: 'bg-mocha-surface0 text-mocha-subtext1 hover:bg-mocha-surface1'}"
			>
				<Star size={16} fill={showFeaturedOnly ? 'currentColor' : 'none'} />
        {m.projects_featured_only()}
			</button>
		</div>
	</div>

	<!-- Tag Filter -->
	{#if data.tags && data.tags.length > 0}
		<div class="mb-8">
			<div class="mb-3 flex items-center gap-2">
				<TagIcon size={18} class="text-mocha-subtext0" />
				<span class="text-sm text-mocha-subtext0">{m.projects_filter_by_tags()}</span>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each data.tags as tag}
					<button
						onclick={() => toggleTag(tag)}
						class="rounded-full px-3 py-1 text-sm transition-colors duration-200
                   {selectedTags.includes(tag)
							? 'bg-mocha-blue text-mocha-base'
							: 'bg-mocha-surface0 text-mocha-subtext1 hover:bg-mocha-surface1'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Results Count -->
	<div class="mb-4 text-sm text-mocha-subtext0">
    {filteredProjects.length} {filteredProjects.length !== 1 ? m.projects_found_plural() : m.projects_found()}
	</div>

	<!-- Projects Grid -->
	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each paginatedData.items as project}
			<ProjectCard {project} />
		{/each}
	</div>

	<!-- Pagination -->
	{#if paginatedData.totalPages > 1}
		<div class="flex justify-center gap-2">
			{#each Array(paginatedData.totalPages) as _, i}
				<button
					onclick={() => updateParams({ page: (i + 1).toString() })}
					class="rounded-lg px-4 py-2 transition-colors duration-200
                 {currentPage === i + 1
						? 'bg-mocha-blue text-mocha-base'
						: 'bg-mocha-surface0 text-mocha-subtext1 hover:bg-mocha-surface1'}"
				>
					{i + 1}
				</button>
			{/each}
		</div>
	{/if}
</div>
