<script lang="ts">
	import type { TimelineItem } from '../../lib/types';

	interface Props {
		items: TimelineItem[];
	}

	let { items }: Props = $props();
</script>

<div class="flex flex-col items-start">
	{#each items as item, index (item.title + item.date)}
		<div class="group flex w-full gap-x-6">
			<div class="relative">
				{#if index !== items.length - 1}
					<div
						class="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-mocha-surface0"
					></div>
				{/if}

				<div
					class="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-mocha-surface0 p-0.5"
				>
					<img
						src={item.imgUrl}
						loading="eager"
						alt="{item.title} logo"
						class="inline-block h-full w-full rounded-full object-cover object-center"
					/>
				</div>
			</div>
			<div class="-translate-y-1.5 {index === items.length - 1 ? 'pb-4' : 'pb-12'}">
				<div class="-mb-1 text-xs font-light text-mocha-subtext0 antialiased">
					{item.date}
				</div>
				<a
					href={item.link}
					target="_blank"
					rel="noopener noreferrer"
					class="text-base font-bold text-mocha-text antialiased transition-colors duration-200 hover:text-mocha-blue"
				>
					{item.title}
				</a>
				<div class="text-xs font-light text-mocha-subtext0 antialiased">
					{item.role}
				</div>
				<div class="mt-2 text-sm text-mocha-text antialiased">
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
