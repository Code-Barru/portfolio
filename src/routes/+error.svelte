<script lang="ts">
	import { page } from '$app/stores';
	import { m } from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{$page.status === 404 ? m.error_404_title() : m.error_generic_title()}</title>
	<meta name="description" content={$page.status === 404 ? m.error_404_description() : m.error_generic_description()} />
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="py-8">
	<h1 class="mb-4 text-4xl font-bold text-mocha-red">
		{$page.status} - {$page.error?.message || ($page.status === 404 ? m.error_404_title() : m.error_generic_title())}
	</h1>

	{#if $page.status === 404}
		<p class="mb-6 text-mocha-subtext1">{m.error_404_description()}</p>
	{:else}
		<p class="mb-6 text-mocha-subtext1">{m.error_generic_description()}</p>
	{/if}

	<a href="/" class="text-mocha-blue hover:underline">{m.error_back_home()}</a>
</div>
