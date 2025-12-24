<script lang="ts">
	import type { TimelineItem } from '$lib/types';

	interface Props {
		items: TimelineItem[];
	}

	let { items }: Props = $props();
</script>

<div class="flex flex-col items-start">
	{#each items as item, index (item.title + item.date)}
			<div class="group flex gap-x-6 w-full">
				<div class="relative">
					{#if index !== items.length - 1}
						<div
							class="bg-mocha-surface0 absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2"
						></div>
					{/if}

					<div
						class="bg-mocha-surface0 relative z-10 grid h-10 w-10 place-items-center rounded-full p-0.5"
					>
						<img
							src={item.darkImgUrl}
							loading="eager"
							alt="{item.title} logo"
							class="inline-block h-full w-full rounded-full object-cover object-center"
						/>
					</div>
				</div>
				<div
					class="-translate-y-1.5 {index === items.length - 1 ? 'pb-4' : 'pb-12'}"
				>
					<div class="text-mocha-subtext0 -mb-1 text-xs font-light antialiased">
						{item.date}
					</div>
					<a
						href={item.link}
						target="_blank"
						rel="noopener noreferrer"
						class="text-mocha-text hover:text-mocha-blue transition-colors duration-200 text-base font-bold antialiased"
					>
						{item.title}
					</a>
					<div class="text-mocha-subtext0 text-xs font-light antialiased">
						{item.role}
					</div>
					<div class="text-mocha-text mt-2 text-sm antialiased">
						<ul class="ml-3 list-disc">
							{#each item.descriptions as description, i (description + i)}
								<li>{description}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
	{/each}
</div>
