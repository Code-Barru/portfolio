<script lang="ts">
  import { m } from '$lib/paraglide/messages';
</script>

<svelte:head>
  <title>Antoine's chronicles - Offensive software enjoyer - {m.privacy_title()}</title>
</svelte:head>

<div class="py-8">
  <h1 class="mb-4 text-3xl font-bold text-mocha-blue md:mb-8 md:text-4xl">{m.privacy_title()}</h1>

  <div class="mb-4 md:mb-8">
    <div class="mb-2 text-xl text-mocha-blue md:text-2xl">{m.privacy_section1_title()}</div>
    <div class="text-sm text-mocha-subtext0 md:text-base">
      {m.privacy_section1_content()}
    </div>
  </div>

  <div class="mb-4 md:mb-8">
    <div class="mb-2 text-xl text-mocha-blue md:text-2xl">{m.privacy_section2_title()}</div>
    <div class="mb-3 text-sm text-mocha-subtext0 md:text-base">
      {m.privacy_section2_intro()}
    </div>
    <ul class="ml-5 list-disc space-y-1 text-sm text-mocha-text md:text-base">
      <li>{m.privacy_section2_page()}</li>
      <li>{m.privacy_section2_device()}</li>
      <li>{m.privacy_section2_location()}</li>
      <li>{m.privacy_section2_language()}</li>
    </ul>
    <div class="mt-3 text-sm font-semibold text-mocha-text md:text-base">
      {m.privacy_section2_not_collected()}
    </div>
  </div>

  <div class="mb-4 md:mb-8">
    <div class="mb-2 text-xl text-mocha-blue md:text-2xl">{m.privacy_section3_title()}</div>
    <div class="text-sm text-mocha-subtext0 md:text-base">
      {m.privacy_section3_content()}
    </div>
  </div>
</div>
