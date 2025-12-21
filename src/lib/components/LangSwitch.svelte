<script lang="ts">
	import { browser } from '$app/environment';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  const LANG_CHANGE_FLAG = 'locale_switching';

  let currentLocale = $state(getLocale());

  function switchLocal() {
    const newLocale = currentLocale === 'en' ? 'fr' : 'en';

    currentLocale = newLocale;

    // Stocker le flag avec timestamp AVANT le changement
    if (browser) {
      sessionStorage.setItem(LANG_CHANGE_FLAG, Date.now().toString());
    }

    setTimeout(() => {
      setLocale(newLocale);
    }, 100);
  }
</script>

<button
  onclick={switchLocal}
  class="relative p-2 rounded cursor-pointer hover:bg-mocha-surface0 active:bg-mocha-surface1 hover:text-mocha-blue font-bold transition-colors duration-200 w-10 h-10 flex items-center justify-center overflow-hidden"
  aria-label="change-language"
>
  {#key currentLocale}
    <div
      in:fly={{ y: 10, duration: 300, easing: quintOut }}
      out:fly={{ y: -10, duration: 300, easing: quintOut }}
      class="absolute inset-0 flex items-center justify-center"
    >
      {#if currentLocale === 'en'}
        EN
      {:else}
        FR
      {/if}
    </div>
  {/key}
</button>
