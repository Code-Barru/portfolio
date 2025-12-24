<script lang="ts">
	import { page } from '$app/stores';
	import { Calendar, Github, ExternalLink, Tag as TagIcon, ArrowLeft, Star } from '@lucide/svelte';
	import type { Project, ProjectFrontmatter } from '$lib/types';
	import { getLocale } from '$lib/paraglide/runtime';

	const currentLocale = getLocale();

	const allModules = import.meta.glob<{ metadata: ProjectFrontmatter; default: any }>(
		'/src/projects/*.md',
		{ eager: true }
	);

	let slug = $derived($page.params.slug);

	let { project, allProjects } = $derived.by(() => {
		let foundProject: (Project & { content: any }) | null = null;
		let projects: Project[] = [];

		for (const [path, module] of Object.entries(allModules)) {
			const filename = path.split('/').pop()?.replace(/\.(md|svx)$/, '').replace(/\.(en|fr)$/, '');

			const localeMatch = path.match(/\.(en|fr)\.md$/);
			const fileLocale = (localeMatch ? localeMatch[1] : 'en') as 'en' | 'fr';

			if (fileLocale !== currentLocale) {
				continue;
			}

			const projectData: Project = {
				...module.metadata,
				slug: filename || '',
				readingTime: 0,
				content: module.default,
				locale: fileLocale
			};

			projects.push(projectData);

			if (filename === slug) {
				foundProject = projectData;
			}
		}

		projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return { project: foundProject, allProjects: projects };
	});

	let currentIndex = $derived(allProjects.findIndex((p) => p.slug === slug));
	let prevProject = $derived(currentIndex > 0 ? allProjects[currentIndex - 1] : null);
	let nextProject = $derived(currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null);

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString(currentLocale === 'fr' ? 'fr-FR' : 'en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{project?.title || 'Project not found'}</title>
	{#if project}
		<meta name="description" content={project.description} />
		<meta property="og:title" content={project.title} />
		<meta property="og:description" content={project.description} />
		{#if project.coverImage}
			<meta property="og:image" content={project.coverImage} />
		{/if}
	{/if}
</svelte:head>

{#if project}

	<div class="py-8">
		<a
			href="/projects"
			class="mb-6 inline-flex items-center gap-2 text-mocha-blue transition-colors hover:text-mocha-sapphire"
		>
			<ArrowLeft size={18} />
			Back to projects
		</a>

		<article>
			<header class="mb-8">
				<div class="mb-4 flex items-start justify-between">
					<h1 class="text-4xl font-bold text-mocha-text md:text-5xl">
						{project.title}
					</h1>
					{#if project.featured}
						<div
							class="flex items-center gap-1 rounded-full bg-mocha-yellow px-3 py-1 text-sm font-bold text-mocha-base"
						>
							<Star size={14} fill="currentColor" />
							Featured
						</div>
					{/if}
				</div>

				<div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-mocha-subtext0">
					<span class="flex items-center gap-1">
						<Calendar size={16} />
						{formatDate(project.date)}
					</span>
					{#if project.status}
						<span class="rounded-full bg-mocha-surface0 px-3 py-1 capitalize">
							{project.status.replace('-', ' ')}
						</span>
					{/if}
				</div>
				<div class="mb-6 flex gap-4">
					{#if project.github}
						<a
							href={project.github}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 rounded-md bg-mocha-base border border-mocha-surface1 border-t-mocha-surface2 px-4 py-2 shadow-mocha-crust shadow-sm
                   text-mocha-text transition-colors duration-200 hover:border-mocha-blue active:bg-mocha-surface0"
						>
							<Github size={18} />
							View Source
						</a>
					{/if}
					{#if project.demoUrl}
						<a
							href={project.demoUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 rounded-md bg-mocha-blue border border-mocha-sapphire border-t-mocha-sky px-4 py-2 shadow-mocha-crust shadow-sm
                   text-mocha-base transition-colors duration-200 hover:bg-mocha-sapphire active:bg-mocha-lavender"
						>
							<ExternalLink size={18} />
							Live Demo
						</a>
					{/if}
				</div>

				{#if project.coverImage}
					<img
						src={project.coverImage}
						alt={project.title}
						class="mb-6 h-80 w-full rounded-lg object-cover"
					/>
				{/if}

				{#if project.tags.length > 0}
					<div class="mb-4 flex flex-wrap gap-2">
						<TagIcon size={16} class="mt-1 text-mocha-subtext0" />
						{#each project.tags as tag}
							<a
								href="/projects?tags={tag}"
								class="rounded-full px-3 py-1 text-sm
									transition-colors duration-200 shadow-mocha-crust shadow-sm
									bg-mocha-base text-mocha-text border border-mocha-surface1 border-t-mocha-surface2 hover:border-mocha-blue active:bg-mocha-surface0"
							>
								{tag}
							</a>
						{/each}
					</div>
				{/if}
			</header>

			<div class="markdown-content mt-8 rounded-lg bg-mocha-crust p-6 md:p-8">
				<project.content />
			</div>
		</article>

		<!-- Previous/Next Navigation -->
		<nav class="mt-12 flex justify-between border-t border-mocha-surface1 pt-8">
			{#if prevProject}
				<a
					href="/projects/{prevProject.slug}"
					class="group flex max-w-[45%] flex-col gap-1 text-left transition-colors"
				>
					<span class="text-xs text-mocha-subtext0">← Previous</span>
					<span
						class="text-sm font-semibold text-mocha-text transition-colors group-hover:text-mocha-blue"
					>
						{prevProject.title}
					</span>
				</a>
			{:else}
				<div></div>
			{/if}

			{#if nextProject}
				<a
					href="/projects/{nextProject.slug}"
					class="group flex max-w-[45%] flex-col gap-1 text-right transition-colors"
				>
					<span class="text-xs text-mocha-subtext0">Next →</span>
					<span
						class="text-sm font-semibold text-mocha-text transition-colors group-hover:text-mocha-blue"
					>
						{nextProject.title}
					</span>
				</a>
			{/if}
		</nav>

		<div class="mt-8 border-t border-mocha-surface1 pt-6">
			<a
				href="/projects"
				class="inline-flex items-center gap-2 text-mocha-blue transition-colors hover:text-mocha-sapphire"
			>
				<ArrowLeft size={18} />
				Back to all projects
			</a>
		</div>
	</div>
{:else}
	<div class="py-8">
		<h1 class="mb-4 text-4xl font-bold text-mocha-red">Project not found</h1>
		<p class="mb-6 text-mocha-subtext1">The project you're looking for doesn't exist.</p>
		<a href="/projects" class="text-mocha-blue hover:underline">Back to projects</a>
	</div>
{/if}
