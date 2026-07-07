<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount, tick } from 'svelte';
	import type { TimelineItem } from '../../lib/types';
	import Timeline from './Timeline.svelte';

	let {
		workLabel,
		educationLabel
	}: {
		workLabel: string;
		educationLabel: string;
	} = $props();

	let selectedOption = $state<'work' | 'education'>('work');
	let containerHeight = $state<number>(0);
	let workRef: HTMLDivElement | null = null;
	let educationRef: HTMLDivElement | null = null;

	let workItems: TimelineItem[] = [
		{
			title: 'Tadao',
			link: 'https://www.tadao.fr/fr/',
			role: 'FullStack Developer (Work-Study)',
			date: 'Jan. 2024 - Present',
			descriptions: [
				'Worked on the development of internal tools.',
				'Fragmented a monolithic application into microservices.'
			],
			imgUrl: '/imgs/tadao.webp'
		}
	];

	let educationItems: TimelineItem[] = [
		{
			title: 'Epitech',
			link: 'https://www.epitech.eu/',
			role: 'Master of Science (Work-Study)',
			date: 'Sep. 2023 - Present',
			descriptions: [
				'Learned in-depth web development.',
				'Learned about the latest methodologies.',
				'Developed a few side projects in Rust.'
			],
			imgUrl: '/imgs/epitech.webp'
		},
		{
			title: 'IUT de Lens',
			link: 'https://www.iut-lens.univ-artois.fr/',
			role: 'DUT Informatique',
			date: 'Sep. 2020 - Jun. 2022',
			descriptions: [
				'Learned the basics of computer science.',
				'Developed a few projects in C++, Java, PHP and Python.'
			],
			imgUrl: '/imgs/iut-lens.webp'
		}
	];

	async function updateHeight() {
		await tick();

		const PADDING = 24;

		const ref = selectedOption === 'work' ? workRef : educationRef;
		if (ref) {
			containerHeight = ref.offsetHeight + PADDING;
		}
	}

	$effect(() => {
		selectedOption;
		updateHeight();
	});

	onMount(() => {
		updateHeight();
	});
</script>

<div
	class="relative flex h-12 w-full rounded-md border border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base p-1 shadow-sm shadow-mocha-crust"
>
	<!-- Sliding indicator -->
	<div
		class="absolute h-4/5 w-1/2 rounded-md border-t border-t-mocha-sapphire bg-mocha-blue shadow-sm shadow-mocha-crust transition-transform duration-300 ease-in-out"
		class:translate-x-full={selectedOption === 'education'}
	></div>

	<!-- Option Work -->
	<label class="relative z-10 flex flex-1 cursor-pointer items-center justify-center">
		<input
			type="radio"
			name="education-type"
			value="work"
			bind:group={selectedOption}
			class="sr-only"
		/>
		<span
			class="font-semibold transition-colors duration-300"
			class:text-mocha-base={selectedOption === 'work'}
			class:text-mocha-subtext0={selectedOption !== 'work'}
			class:hover:text-mocha-text={selectedOption !== 'work'}
		>
			{workLabel}
		</span>
	</label>

	<!-- Option Education -->
	<label class="relative z-10 flex flex-1 cursor-pointer items-center justify-center">
		<input
			type="radio"
			name="education-type"
			value="education"
			bind:group={selectedOption}
			class="sr-only"
		/>
		<span
			class="font-semibold transition-colors duration-300"
			class:text-mocha-base={selectedOption === 'education'}
			class:text-mocha-subtext0={selectedOption !== 'education'}
			class:hover:text-mocha-text={selectedOption !== 'education'}
		>
			{educationLabel}
		</span>
	</label>
</div>
<!-- Hidden elements for height measurement -->
<div class="pointer-events-none invisible absolute right-0 left-0 w-full">
	<div bind:this={workRef} class="px-3">
		<Timeline items={workItems} />
	</div>
</div>
<div class="pointer-events-none invisible absolute right-0 left-0 w-full">
	<div bind:this={educationRef} class="px-3">
		<Timeline items={educationItems} />
	</div>
</div>

<!-- Content section -->
<div
	class="mt-1 rounded-md border border-mocha-surface1 border-t-mocha-surface2 bg-mocha-base p-3 shadow-sm shadow-mocha-crust transition-all duration-300 ease-in-out md:mt-4"
	style="height: {containerHeight}px"
>
	<div class="overflow-hidden">
		<div class="grid">
			{#key selectedOption}
				<div
					class="col-start-1 row-start-1 mt-1"
					in:fly={{
						x: selectedOption === 'education' ? 100 : -100,
						duration: 300,
						easing: quintOut
					}}
					out:fly={{
						x: selectedOption === 'education' ? -100 : 100,
						duration: 300,
						easing: quintOut
					}}
				>
					{#if selectedOption === 'work'}
						<Timeline items={workItems} />
					{:else}
						<Timeline items={educationItems} />
					{/if}
				</div>
			{/key}
		</div>
	</div>
</div>
