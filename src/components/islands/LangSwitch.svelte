<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { localizePath, stripLocale, type Locale } from '../../i18n';

	const LANG_CHANGE_FLAG = 'locale_switching';

	let { currentLocale }: { currentLocale: Locale } = $props();

	let displayedLocale = $state(currentLocale);

	function switchLocale() {
		const newLocale: Locale = displayedLocale === 'en' ? 'fr' : 'en';
		displayedLocale = newLocale;

		document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
		sessionStorage.setItem(LANG_CHANGE_FLAG, Date.now().toString());

		setTimeout(() => {
			const { path } = stripLocale(window.location.pathname);
			window.location.assign(
				localizePath(path, newLocale) + window.location.search + window.location.hash
			);
		}, 100);
	}
</script>

<button
	onclick={switchLocale}
	class="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded p-2 font-bold transition-colors duration-200 hover:bg-mocha-surface0 hover:text-mocha-blue active:bg-mocha-surface1"
	aria-label="change-language"
>
	{#key displayedLocale}
		<div
			in:fly={{ y: 10, duration: 300, easing: quintOut }}
			out:fly={{ y: -10, duration: 300, easing: quintOut }}
			class="absolute inset-0 flex items-center justify-center"
		>
			{displayedLocale}
		</div>
	{/key}
</button>
