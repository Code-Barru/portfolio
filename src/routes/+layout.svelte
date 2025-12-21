<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import { page } from '$app/state';
	import { pageTransition } from '$lib/transitions';
	import { beforeNavigate } from '$app/navigation';

	let { children } = $props();

	const routeOrder: Record<string, number> = {
		'/': 1,
		'/projects': 2,
		'/posts': 3,
		'/contact': 4
	};

	function calculateNavigationDirection(
		fromPath: string | null,
		toPath: string
	): 'left' | 'right' | 'bottom' {
		if (fromPath === null) {
			return 'bottom';
		}

		const fromIndex = routeOrder[fromPath] ?? 1;
		const toIndex = routeOrder[toPath] ?? 1;
		const distance = toIndex - fromIndex;

		// distance > 0 : vers la gauche
		// distance < 0 : vers la droite
		// distance = 0 : mêmme page
		if (distance > 0) {
			return 'right';
		} else if (distance < 0) {
			return 'left';
		} else {
			return 'right';
		}
	}

	let previousPath = $state<string | null>(null);
	let transitionDirection = $state<'left' | 'right' | 'bottom'>('bottom');

	beforeNavigate((navigation) => {
		const toPath = navigation.to?.url.pathname ?? '/';
		transitionDirection = calculateNavigationDirection(previousPath, toPath);
		previousPath = toPath;
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="mx-auto flex min-h-screen flex-col px-3 md:max-w-3xl md:px-8">
	<Navbar />
	{#key page.url.pathname}
		<div in:pageTransition={{ direction: transitionDirection }}>
			{@render children()}
		</div>
	{/key}
</div>
