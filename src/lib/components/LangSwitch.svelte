<script lang="ts">
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  let currentLocale = $state(getLocale());

  function switchLocal() {
    const newLocale = currentLocale === 'en' ? 'fr' : 'en';

    currentLocale = newLocale;

    setTimeout(() => {
      setLocale(newLocale);
    }, 200);
  }
</script>

<button
  onclick={switchLocal}
  class="relative p-2 rounded cursor-pointer hover:bg-mocha-surface0 active:bg-mocha-surface1 transition-colors duration-200 w-10 h-10 flex items-center justify-center overflow-hidden"
  aria-label="change-language"
>
  {#key currentLocale}
    <div
      in:fly={{ y: 10, duration: 300, easing: quintOut }}
      out:fly={{ y: -10, duration: 300, easing: quintOut }}
      class="absolute inset-0 flex items-center justify-center"
    >
      {#if currentLocale === 'en'}
        <!-- UK Flag -->
        <svg width="24" height="24" viewBox="0 0 60 30">
          <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z"/>
          </clipPath>
          <clipPath id="t">
            <path d="M30,15 h30 v15 z v-30 h-30 z h-30 v15 z v-30 h30 z"/>
          </clipPath>
          <g clip-path="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>
          </g>
        </svg>
      {:else}
        <!-- French Flag -->
        <svg width="24" height="24" viewBox="0 0 900 600" class="opacity-90">
          <rect x="0" y="0" width="300" height="600" fill="#0055A4"/>
          <rect x="300" y="0" width="300" height="600" fill="#fff"/>
          <rect x="600" y="0" width="300" height="600" fill="#ED2939"/>
        </svg>
      {/if}
    </div>
  {/key}
</button>
