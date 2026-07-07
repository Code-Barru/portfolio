<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, Tag as TagIcon } from '@lucide/svelte';
	import { searchItems, filterByTags, paginateItems } from '../../lib/content';
	import type { PostMeta } from '../../lib/types';
	import type { Locale } from '../../i18n';
	import PostCard from '../PostCard.svelte';

	const ITEMS_PER_PAGE = 10;

	interface Props {
		posts: PostMeta[];
		tags: string[];
		locale: Locale;
		labels: {
			search: string;
			filterByTags: string;
			found: string;
			foundPlural: string;
		};
	}

	let { posts, tags, locale, labels }: Props = $props();

	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);
	let currentPage = $state(1);

	function readParams() {
		const params = new URLSearchParams(window.location.search);
		selectedTags = params.get('tags')?.split(',').filter(Boolean) || [];
		currentPage = Number(params.get('page')) || 1;
	}

	onMount(() => {
		readParams();
		const onPopState = () => readParams();
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	});

	let filteredPosts = $derived.by(() => {
		let result = searchItems(posts, searchQuery);
		result = filterByTags(result, selectedTags);
		return result;
	});

	let paginatedData = $derived(paginateItems(filteredPosts, currentPage, ITEMS_PER_PAGE));

	function updateParams(updates: Record<string, string | null>) {
		const params = new URLSearchParams(window.location.search);

		for (const [key, value] of Object.entries(updates)) {
			if (value === null || value === '') {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		}

		const query = params.toString();
		history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
		readParams();
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

<!-- Search Bar -->
<div class="mb-6">
	<div class="relative">
		<Search
			class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-mocha-subtext0"
			size={20}
		/>
		<input
			type="text"
			placeholder={labels.search}
			bind:value={searchQuery}
			class="w-full rounded-md border border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base py-2 pr-4 pl-10 text-mocha-text placeholder-mocha-subtext0
               shadow-sm shadow-mocha-crust
               transition-colors duration-200 focus:border-mocha-blue focus:outline-none"
		/>
	</div>
</div>

<!-- Tag Filter -->
{#if tags.length > 0}
	<div class="mb-8">
		<div class="mb-3 flex items-center gap-2">
			<TagIcon size={18} class="text-mocha-subtext0" />
			<span class="text-sm text-mocha-subtext0">{labels.filterByTags}</span>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each tags as tag}
				<button
					onclick={() => toggleTag(tag)}
					class="rounded-full border px-3 py-1 text-sm shadow-sm shadow-mocha-crust transition-colors duration-200
                   {selectedTags.includes(tag)
						? 'border-mocha-sapphire border-t-mocha-sky bg-mocha-blue text-mocha-base'
						: 'border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base text-mocha-text hover:border-mocha-blue active:bg-mocha-surface0'}"
				>
					{tag}
				</button>
			{/each}
		</div>
	</div>
{/if}

<!-- Results Count -->
<div class="mb-4 text-sm text-mocha-subtext0">
	{filteredPosts.length}
	{filteredPosts.length !== 1 ? labels.foundPlural : labels.found}
</div>

<!-- Posts List -->
<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
	{#each paginatedData.items as post (post.slug)}
		<PostCard {post} {locale} />
	{/each}
</div>

<!-- Pagination -->
{#if paginatedData.totalPages > 1}
	<div class="flex justify-center gap-2">
		{#each Array(paginatedData.totalPages) as _, i}
			<button
				onclick={() => updateParams({ page: (i + 1).toString() })}
				class="rounded-md border px-4 py-2 shadow-sm shadow-mocha-crust transition-colors duration-200
                 {currentPage === i + 1
					? 'border-mocha-sapphire border-t-mocha-sky bg-mocha-blue text-mocha-base'
					: 'border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base text-mocha-text hover:border-mocha-blue active:bg-mocha-surface0'}"
			>
				{i + 1}
			</button>
		{/each}
	</div>
{/if}
