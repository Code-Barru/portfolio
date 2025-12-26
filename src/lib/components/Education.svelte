<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount, tick } from 'svelte';
  import type { TimelineItem } from '$lib/types';
  import Timeline from './Timeline.svelte';

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
        imgUrl: '/imgs/tadao.webp',
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

<div class="relative flex w-full h-12 bg-mocha-base border border-mocha-surface1 rounded-md shadow-mocha-crust shadow-sm border-t-mocha-surface2 p-1">
	<!-- Sliding indicator -->
	<div
		class="absolute h-4/5 w-1/2 bg-mocha-blue rounded-md shadow-mocha-crust shadow-sm border-t border-t-mocha-sapphire transition-transform duration-300 ease-in-out"
		class:translate-x-full={selectedOption === 'education'}
	></div>

	<!-- Option Work -->
	<label class="flex-1 flex items-center justify-center cursor-pointer z-10 relative">
		<input type="radio" name="education-type" value="work" bind:group={selectedOption} class="sr-only" />
		<span
			class="font-semibold transition-colors duration-300"
			class:text-mocha-base={selectedOption === 'work'}
			class:text-mocha-subtext0={selectedOption !== 'work'}
			class:hover:text-mocha-text={selectedOption !== 'work'}
		>
			{m.education_work()}
		</span>
	</label>

	<!-- Option Education -->
	<label class="flex-1 flex items-center justify-center cursor-pointer z-10 relative">
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
			{m.education_education()}
		</span>
	</label>
</div>
<!-- Hidden elements for height measurement -->
<div class="invisible absolute pointer-events-none w-full left-0 right-0">
	<div bind:this={workRef} class="px-3">
		<Timeline items={workItems} />
	</div>
</div>
<div class="invisible absolute pointer-events-none w-full left-0 right-0">
	<div bind:this={educationRef} class="px-3">
		<Timeline items={educationItems} />
	</div>
</div>

<!-- Content section -->
<div
	class="mt-1 md:mt-4 bg-mocha-base border border-mocha-surface1 rounded-md shadow-mocha-crust shadow-sm border-t-mocha-surface2 p-3 transition-all duration-300 ease-in-out"
	style="height: {containerHeight}px"
>
	<div class="overflow-hidden">
		<div class="grid">
			{#key selectedOption}
				<div
					class="col-start-1 row-start-1 mt-1"
					in:fly={{ x: selectedOption === 'education' ? 100 : -100, duration: 300, easing: quintOut }}
					out:fly={{ x: selectedOption === 'education' ? -100 : 100, duration: 300, easing: quintOut }}
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
