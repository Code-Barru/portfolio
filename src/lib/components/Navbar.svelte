<script lang="ts">
  import LangSwitch from "$lib/components/LangSwitch.svelte";
  import { m } from "$lib/paraglide/messages";
  import type { NavBarItem } from "$lib/types";

  let links: NavBarItem[] = [
    {
      label: m.nav_home(),
      link: '/'
    },
    {
      label: m.nav_projects(),
      link: '/projects'
    },
    {
      label: m.nav_blog(),
      link: '/posts'
    },
    {
      label: m.nav_contact(),
      link: '/contact'
    },
  ]
</script>

<header
  class="sticky top-0 z-50 -mx-1 my-6 bg-mocha-base"
>
  <nav class="flex items-center justify-between">
    <ul class="flex gap-4 sm:gap-8">
      {#each links as item}
        <li class="hover:text-mocha-blue transition-colors duration-200">
          <a href="{item.link}">{item.label}</a>
        </li>
      {/each}
    </ul>
    <div class="ml-auto flex flex-row items-center gap-2">
      <LangSwitch />
    </div>
  </nav>
</header>
