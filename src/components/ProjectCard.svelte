<script lang="ts">
	import type { ProjectMeta } from '../lib/types';
	import { Github, ExternalLink, Star, FolderOpen, Calendar } from '@lucide/svelte';
	import { localizePath, type Locale } from '../i18n';

	interface Props {
		project: ProjectMeta;
		locale: Locale;
		featuredLabel: string;
		readMoreLabel: string;
	}

	let { project, locale, featuredLabel, readMoreLabel }: Props = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
			year: 'numeric',
			month: 'short'
		});
	}

	const titleColor = $derived(
		project.status === 'completed'
			? 'text-mocha-green'
			: project.status === 'in-progress'
				? 'text-mocha-yellow'
				: project.status === 'archived'
					? 'text-mocha-subtext0'
					: 'text-mocha-green'
	);
</script>

<div
	class="group relative overflow-hidden rounded-md border border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base shadow-sm shadow-mocha-crust
              transition-all duration-200 hover:border-mocha-blue hover:shadow-md"
>
	{#if project.featured}
		<div
			class="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-mocha-yellow px-2 py-1 text-xs font-bold text-mocha-base"
		>
			<Star size={12} fill="currentColor" />
			{featuredLabel}
		</div>
	{/if}

	<div class="flex h-48 items-center justify-center bg-mocha-crust">
		<div class="w-full px-6 py-8">
			<div class="mb-3 flex items-center gap-2 font-mono text-sm">
				<span class="text-mocha-blue">➜</span>
				<span class="text-mocha-sapphire">~</span>
				<span class="text-mocha-text">/</span>
				<span class="font-bold {titleColor} transition-colors group-hover:text-mocha-blue"
					>{project.title}</span
				>
			</div>

			<div class="flex items-start gap-3">
				<FolderOpen size={24} class="mt-0.5 shrink-0 text-mocha-yellow" />
				<div class="min-w-0 flex-1">
					<div class="wrap-break-words font-mono text-sm text-mocha-subtext0">
						{project.description}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="p-5">
		<div class="mb-3 flex items-center gap-1 font-mono text-xs">
			<span class="text-mocha-text"><Calendar size={16} /></span>
			<span class="text-mocha-text">{formatDate(project.date)}</span>
			{#if project.status}
				<span class="text-mocha-yellow">|</span>
				<span class="text-mocha-sapphire capitalize">{project.status.replace('-', ' ')}</span>
			{/if}
		</div>

		{#if project.tags && project.tags.length > 0}
			<div class="mb-4 flex flex-wrap gap-1">
				{#each project.tags as tag}
					<span class="rounded bg-mocha-mantle px-2 py-0.5 text-xs text-mocha-subtext0">
						#{tag}
					</span>
				{/each}
			</div>
		{/if}

		<div class="flex gap-3 border-t border-mocha-surface1 pt-3">
			{#if project.github}
				<a
					href={project.github}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-1 rounded-md border border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base px-2 py-1 text-sm text-mocha-text shadow-sm shadow-mocha-crust transition-colors duration-200 hover:border-mocha-blue"
				>
					<Github size={16} />
					Code
				</a>
			{/if}
			{#if project.demoUrl}
				<a
					href={project.demoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-1 rounded-md border border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base px-2 py-1 text-sm text-mocha-text shadow-sm shadow-mocha-crust transition-colors duration-200 hover:border-mocha-blue"
				>
					<ExternalLink size={16} />
					Demo
				</a>
			{/if}
			<a
				href={localizePath(`/projects/${project.slug}`, locale)}
				class="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-sm text-mocha-text transition-colors duration-200 hover:text-mocha-blue"
			>
				{readMoreLabel} →
			</a>
		</div>
	</div>
</div>
