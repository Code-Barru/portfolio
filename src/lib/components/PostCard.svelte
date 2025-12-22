<script lang="ts">
	import type { Post } from '$lib/types';
	import { FileText, Calendar } from '@lucide/svelte';
	import { getLocale } from '$lib/paraglide/runtime';

	interface Props {
		post: Omit<Post, 'content'>;
	}

	let { post }: Props = $props();
	const currentLocale = getLocale();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString(currentLocale === 'fr' ? 'fr-FR' : 'en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<a
	href="/posts/{post.slug}"
	class="block group relative overflow-hidden rounded-lg border border-mocha-surface1 bg-mocha-surface0
	       transition-colors duration-200 hover:border-mocha-blue"
>
	<!-- Terminal Section -->
	<div class="flex h-40 items-center justify-center bg-mocha-crust">
		<div class="w-full px-5 py-5">
			<!-- Prompt Starship -->
			<div class="mb-2 flex items-center gap-2 font-mono text-sm">
				<span class="text-mocha-blue">➜</span>
				<span class="text-mocha-sapphire">~</span>
				<span class="text-mocha-text">/</span>
				<span class="font-bold text-mocha-green transition-colors group-hover:text-mocha-blue">
					{post.title}
				</span>
			</div>

			<!-- Icône + Description -->
			<div class="flex items-start gap-2">
				<FileText size={20} class="mt-0.5 flex-shrink-0 text-mocha-yellow" />
				<div class="min-w-0 flex-1">
					<div class="break-words font-mono text-sm text-mocha-subtext0 line-clamp-3">
						{post.description}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Metadata Section -->
	<div class="p-4">
		<!-- Date + Temps de lecture (style terminal) -->
		<div class="mb-3 flex items-center gap-2 font-mono text-xs">
			<Calendar size={14} />
			<span class="text-mocha-text">{formatDate(post.date)}</span>
			{#if post.readingTime && post.readingTime > 0}
				<span class="text-mocha-yellow">|</span>
				<span class="text-mocha-sapphire">{post.readingTime} min read</span>
			{/if}
		</div>

		<!-- Tags -->
		{#if post.tags && post.tags.length > 0}
			<div class="mb-3 flex flex-wrap gap-1">
				{#each post.tags as tag}
					<span class="rounded bg-mocha-mantle px-2 py-0.5 text-xs text-mocha-subtext0">
						#{tag}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</a>
