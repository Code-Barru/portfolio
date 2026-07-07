<script lang="ts">
	import { CircleCheck, CircleX, LoaderCircle, Send } from '@lucide/svelte';

	let {
		labels
	}: {
		labels: {
			name: string;
			email: string;
			textarea: string;
			send: string;
			sending: string;
			success: string;
			error: string;
		};
	} = $props();

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let status: 'idle' | 'loading' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!name.trim() || !email.trim() || !message.trim()) return;

		status = 'loading';
		errorMessage = '';

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					message: message.trim()
				})
			});

			if (!res.ok) {
				const data = await res.json().catch(() => null);
				throw new Error(data?.detail ?? 'Unknown error');
			}

			status = 'success';
			name = '';
			email = '';
			message = '';
		} catch (err) {
			status = 'error';
			errorMessage = err instanceof Error ? err.message : 'Unknown error';
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
		<div class="h-10">
			<input
				class="border-input flex h-9 w-full rounded-md border border-mocha-surface0 bg-mocha-surface0 px-3 py-1 text-sm text-mocha-text antialiased focus:border-mocha-blue focus:ring-0 focus:outline-0"
				id="name"
				placeholder={labels.name}
				autocomplete="given-name"
				type="text"
				name="name"
				required
				disabled={status === 'loading'}
				bind:value={name}
			/>
		</div>
		<div class="h-10">
			<input
				class="border-input flex h-9 w-full rounded-md border border-mocha-surface0 bg-mocha-surface0 px-3 py-1 text-sm text-mocha-text antialiased focus:border-mocha-blue focus:ring-0 focus:outline-0"
				id="email"
				placeholder={labels.email}
				autocomplete="email"
				type="email"
				name="email"
				required
				disabled={status === 'loading'}
				bind:value={email}
			/>
		</div>
		<div class="mb-3 h-32 sm:col-span-2">
			<textarea
				class="border-input mb-5 flex h-32 w-full resize-none rounded-md border border-mocha-surface0 bg-mocha-surface0 px-3 py-1 text-sm text-mocha-text antialiased focus:border-mocha-blue focus:ring-0 focus:outline-0"
				rows="4"
				placeholder={labels.textarea}
				name="message"
				required
				disabled={status === 'loading'}
				bind:value={message}
			></textarea>
		</div>
	</div>

	{#if status === 'success'}
		<div class="mb-3 flex items-center gap-2 text-sm text-mocha-green">
			<CircleCheck size={16} />
			<span>{labels.success}</span>
		</div>
	{/if}

	{#if status === 'error'}
		<div class="mb-3 flex items-center gap-2 text-sm text-mocha-red">
			<CircleX size={16} />
			<span>{labels.error}{errorMessage ? `: ${errorMessage}` : ''}</span>
		</div>
	{/if}

	<button
		type="submit"
		disabled={status === 'loading'}
		class="w-full cursor-pointer rounded-md border border-mocha-sapphire border-t-mocha-sky bg-mocha-blue/80 px-4 py-2 text-mocha-base shadow-sm shadow-mocha-crust transition-colors duration-200 hover:bg-mocha-blue/90 focus:ring-0 focus:outline-none active:bg-mocha-blue disabled:cursor-not-allowed disabled:opacity-50"
	>
		<div class="flex items-center justify-center gap-1">
			{#if status === 'loading'}
				{labels.sending}
				<LoaderCircle size={18} class="animate-spin" />
			{:else}
				{labels.send}
				<Send size={18} />
			{/if}
		</div>
	</button>
</form>
