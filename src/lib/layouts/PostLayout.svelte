<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<article
	class="prose prose-invert max-w-none
  prose-headings:text-mocha-blue
  prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-4
  prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3
  prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
  prose-p:text-mocha-text prose-p:leading-7
  prose-a:text-mocha-sapphire prose-a:no-underline hover:prose-a:text-mocha-sky hover:prose-a:underline
  prose-strong:text-mocha-text prose-strong:font-semibold
  prose-em:text-mocha-text prose-em:italic
  prose-code:text-mocha-peach prose-code:bg-mocha-surface0 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
  prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-mocha-mantle prose-pre:border prose-pre:border-mocha-surface0 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
  prose-pre:text-mocha-text
  prose-blockquote:border-l-4 prose-blockquote:border-mocha-blue prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-mocha-subtext0
  prose-ul:text-mocha-text prose-ul:list-disc prose-ul:pl-6
  prose-ol:text-mocha-text prose-ol:list-decimal prose-ol:pl-6
  prose-li:text-mocha-text prose-li:my-1
  prose-table:text-mocha-text prose-table:border-collapse
  prose-th:bg-mocha-surface0 prose-th:border prose-th:border-mocha-surface1 prose-th:px-4 prose-th:py-2
  prose-td:border prose-td:border-mocha-surface1 prose-td:px-4 prose-td:py-2
  prose-img:rounded-lg prose-img:my-6
  prose-hr:border-mocha-surface1 prose-hr:my-8"
>
	{@render children()}
</article>
