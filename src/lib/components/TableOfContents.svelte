<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import type { TOCItem } from '$lib/utils/toc';
	import { extractHeadings } from '$lib/utils/toc';
	import * as m from '$lib/paraglide/messages';

	let headings = $state<TOCItem[]>([]);
	let activeId = $state<string | null>(null);
	let observer: IntersectionObserver | null = null;
	let mounted = $state(false);

	onMount(async () => {
		await tick();

		const waitForContent = () => {
			const content = document.querySelector('.markdown-content');
			if (content) {
				headings = extractHeadings(content);
				setupObserver();
				setTimeout(() => {
					mounted = true;
				}, 450);
			} else {
				requestAnimationFrame(waitForContent);
			}
		};

		waitForContent();
	});

	function setupObserver() {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				});
			},
			{
				rootMargin: '0px 0px -80% 0px',
				threshold: 0
			}
		);

		headings.forEach((item) => {
			observer?.observe(item.element);
			item.children.forEach((child) => observer?.observe(child.element));
		});
	}

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

<nav class="hidden lg:block fixed left-8 top-24 w-56 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg bg-mocha-crust p-4 transition-opacity duration-500 {mounted ? 'opacity-100' : 'opacity-0'}">
	<h3 class="mb-4 text-sm font-bold text-mocha-text">{m.toc_title()}</h3>
	<ul class="space-y-2">
		{#each headings as item}
			<li>
				<a
					href="#{item.id}"
					class="block py-1 text-sm transition-all duration-200 ease-out
						{activeId === item.id
						? 'border-l-2 border-mocha-blue pl-3 font-semibold text-mocha-blue'
						: 'pl-4 text-mocha-subtext0 hover:text-mocha-subtext1'}"
				>
					{item.text}
				</a>

				{#if item.children.length > 0}
					<ul class="ml-4 mt-1 space-y-1">
						{#each item.children as child}
							<li>
								<a
									href="#{child.id}"
									class="block py-1 text-xs transition-all duration-200 ease-out
										{activeId === child.id
										? 'font-semibold text-mocha-blue'
										: 'text-mocha-subtext0 hover:text-mocha-subtext1'}"
								>
									{child.text}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
</nav>
