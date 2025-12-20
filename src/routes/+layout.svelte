<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
  import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="mx-auto flex min-h-screen flex-col px-2 md:max-w-3xl md:px-8">
  <Navbar />
  {@render children()}
</div>

<style>

body {
  background-color: --color-mocha-base;
}
</style>
