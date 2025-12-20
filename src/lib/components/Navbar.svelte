<script lang="ts">
  import LangSwitch from "$lib/components/LangSwitch.svelte";
</script>

<header
  class="sticky top-0 z-50 -mx-1 my-6"
>
  <nav class="flex items-center justify-between">
    <ul class="flex gap-4 sm:gap-8">
      <li
        class="hover:text-mocha-lavender duration-200 ease-in-out"
      >
        <a href="/">home</a>
      </li>
      <li
        class="hover:text-mocha-lavender duration-200 ease-in-out"
      >
        <a href="/projects">projects</a>
      </li>
      <li
        class="hover:text-mocha-lavender duration-200 ease-in-out"
      >
        <a href="/posts">blog</a>
      </li>
      <li
        class="hover:text-mocha-lavender duration-200 ease-in-out"
      >
        <a href="/contact">contact</a>
      </li>
    </ul>
    <div class="ml-auto flex flex-row items-center gap-2">
      <LangSwitch />
    </div>
  </nav>
</header>
