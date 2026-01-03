<script lang="ts">
	import { CircleCheck, CircleX, LoaderCircle, Send } from '@lucide/svelte';
  import { m } from "$lib/paraglide/messages";
	import { getLocale } from '$lib/paraglide/runtime';

	const currentLocale = getLocale();
	const baseUrl = 'https://antoineousselin.fr';

	let name = $state('');
	let email = $state('');
	let message = $state('');

</script>

<svelte:head>
	<title>{m.seo_contact_title()}</title>
	<meta name="description" content={m.seo_contact_description()} />

	<link rel="canonical" href="{baseUrl}/contact" />

	<meta property="og:title" content={m.seo_contact_title()} />
	<meta property="og:description" content={m.seo_contact_description()} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{baseUrl}/contact" />
	<meta property="og:locale" content={currentLocale === 'fr' ? 'fr_FR' : 'en_US'} />

	<link rel="alternate" hreflang="en" href="{baseUrl}/en/contact" />
	<link rel="alternate" hreflang="fr" href="{baseUrl}/fr/contact" />
	<link rel="alternate" hreflang="x-default" href="{baseUrl}/contact" />
</svelte:head>

<div class="py-8">
<h1 class="mb-8 text-4xl font-bold text-mocha-blue">contact me</h1>

<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
	<div class="h-10">
		<input
			class="border-input  focus:border-mocha-blue border-mocha-surface0 bg-mocha-surface0 text-mocha-text flex h-9 w-full rounded-md border px-3 py-1 text-sm antialiased focus:ring-0 focus:outline-0"
			id="name"
			placeholder={m.contact_name()}
			autocomplete="given-name"
			type="text"
			name="name"
			required
			bind:value={name}
		/>
	</div>
	<div class="h-10">
		<input
			class="border-input  focus:border-mocha-blue border-mocha-surface0 bg-mocha-surface0 text-mocha-text flex h-9 w-full rounded-md border px-3 py-1 text-sm antialiased focus:ring-0 focus:outline-0"
			id="email"
			placeholder={m.contact_email()}
			autocomplete="email"
			type="email"
			name="email"
			required
			bind:value={email}
		/>
	</div>
	<div class="h-32 sm:col-span-2 mb-3">
		<textarea
			class="border-input mb-5  focus:border-mocha-blue border-mocha-surface0 resize-nonce bg-mocha-surface0 text-mocha-text flex h-32 w-full rounded-md border px-3 py-1 text-sm antialiased focus:ring-0 focus:outline-0"
			rows="4"
			placeholder={m.contact_textarea()}
			name="message"
			required
			bind:value={message}
		></textarea>
	</div>
</div>
<button
  type="submit"
  class="bg-mocha-blue border border-mocha-sapphire border-t-mocha-sky hover:bg-mocha-sapphire active:bg-mocha-sky text-mocha-base w-full cursor-pointer rounded-md px-4 py-2 shadow-sm shadow-mocha-crust transition-colors duration-200 focus:ring-0 focus:outline-none"
>
  <div class="flex items-center justify-center gap-1">
    Send
    <Send size="18" />
  </div>
</button>
</div>
