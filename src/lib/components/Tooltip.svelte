<script lang="ts">
  import { type Snippet } from 'svelte';

  interface Props {
    text: string;
    children: Snippet;
    position?: 'top' | 'bottom' | 'left' | 'right';
  }

  let { text, children, position = 'top' }: Props = $props();

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
  };
</script>

<div class="relative inline-block group">
  {@render children()}

  <div class="absolute {positionClasses[position]} pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
    <div class="bg-mocha-surface0 text-mocha-text text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
      {text}
    </div>
    <div class="absolute {arrowClasses[position]} w-0 h-0 border-4 border-mocha-surface0"></div>
  </div>
</div>
