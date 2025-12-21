<script lang="ts">
	import { CircleCheck, CircleX, LoaderCircle, Send } from '@lucide/svelte';
  import { m } from "$lib/paraglide/messages";

	let name = $state('');
	let email = $state('');
	let message = $state('');

	let loading = $state(false);
	let success = $state(false);
	let error = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!name || !email || !message) {
			return;
		}
		loading = true;
		error = false;
		success = false;

		const data = {
			name,
			email,
			message
		};

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			success = true;
		} catch (err) {
			console.log(err);
			error = true;
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Antoine's chronicles - Offensive software enjoyer - Contact</title>
</svelte:head>

<div class="text-start text-3xl font-bold">contact me</div>

<div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
	<div class="h-16">
		<input
			class="border-input  focus:border-mocha-lavender border-mocha-surface0 bg-mocha-surface0 text-mocha-text flex h-9 w-full rounded-md border px-3 py-1 text-sm antialiased focus:ring-0 focus:outline-0"
			id="name"
			placeholder={m.contact_name()}
			autocomplete="given-name"
			type="text"
			name="name"
			required
			bind:value={name}
		/>
	</div>
	<div class="h-16">
		<input
			class="border-input  focus:border-mocha-lavender border-mocha-surface0 bg-mocha-surface0 text-mocha-text flex h-9 w-full rounded-md border px-3 py-1 text-sm antialiased focus:ring-0 focus:outline-0"
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
			class="border-input mb-5  focus:border-mocha-lavender border-mocha-surface0 resize-nonce bg-mocha-surface0 text-mocha-text flex h-32 w-full rounded-md border px-3 py-1 text-sm antialiased focus:ring-0 focus:outline-0"
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
  onclick={handleSubmit}
  class="bg-mocha-blue/80 text-mocha-base hover:bg-mocha-blue/90 active:bg-mocha-blue w-full cursor-pointer rounded-md border-t-3 border-mocha-blue px-4 py-2 shadow-sm shadow-mocha-crust transition-colors duration-200 focus:ring-0 focus:outline-none"
>
  <div class="flex items-center justify-center gap-1">
    Send
    <Send size="18" />
  </div>
</button>
