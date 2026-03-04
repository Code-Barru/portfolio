<script lang="ts">
  import { onMount } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import { getLocale } from '$lib/paraglide/runtime';

  const HEATMAP_URL =
    'https://heatmap.shymike.dev/?id=29100&timezone=Europe%2FParis&cell_size=15&rounding=100&labels=true&theme=catppuccin_dark';

  let svgContent = $state('');
  let loading = $state(true);
  let error = $state(false);

  const months: Record<string, string> = {
    'January': 'Janvier', 'February': 'Février', 'March': 'Mars',
    'April': 'Avril', 'May': 'Mai', 'June': 'Juin',
    'July': 'Juillet', 'August': 'Août', 'September': 'Septembre',
    'October': 'Octobre', 'November': 'Novembre', 'December': 'Décembre'
  };

  const monthsShort: Record<string, string> = {
    'Jan': 'Jan', 'Feb': 'Fév', 'Mar': 'Mars', 'Apr': 'Avr',
    'May': 'Mai', 'Jun': 'Juin', 'Jul': 'Juil', 'Aug': 'Août',
    'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Déc'
  };

  const daysShort: Record<string, string> = {
    'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mer',
    'Thu': 'Jeu', 'Fri': 'Ven', 'Sat': 'Sam', 'Sun': 'Dim'
  };

  function localizeSvg(svg: string): string {
    const locale = getLocale();
    if (locale !== 'fr') return svg;

    svg = svg.replace(
      /No activity on (\w+) (\d+)\w{0,2}/g,
      (_, month, day) => `Aucune activité le ${day} ${months[month] ?? month}`
    );

    svg = svg.replace(
      /([\dhms ]+) on (\w+) (\d+)\w{0,2}/g,
      (_, duration, month, day) => `${duration.trim()} le ${day} ${months[month] ?? month}`
    );

    for (const [en, fr] of Object.entries(monthsShort)) {
      svg = svg.replaceAll(`>\n${en}\n<`, `>\n${fr}\n<`);
    }

    for (const [en, fr] of Object.entries(daysShort)) {
      svg = svg.replaceAll(`>\n${en}\n<`, `>\n${fr}\n<`);
    }

    svg = svg.replaceAll('>Less<', '>Moins<').replaceAll('>More<', '>Plus<');
    svg = svg.replace(/>\nLess\n</, '>\nMoins\n<').replace(/>\nMore\n</, '>\nPlus\n<');

    return svg;
  }

  onMount(async () => {
    try {
      const res = await fetch(HEATMAP_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let text = await res.text();
      if (text.trimStart().startsWith('<svg')) {
        // Remap activity colors to blue gradient (light -> dark)
        text = text
          .replaceAll('#a6e3a1', '#2e4263')  // least active
          .replaceAll('#f9e2af', '#3d6290')  // moderate
          .replaceAll('#fab387', '#5a8bc7')  // active
          .replaceAll('#f38ba8', '#89b4fa'); // most active (mocha-blue)

        svgContent = localizeSvg(text);
      } else {
        throw new Error('Response is not SVG');
      }
    } catch {
      error = true;
    } finally {
      loading = false;
    }
  });
</script>

<section>
  <h2 class="text-3xl font-bold text-mocha-blue mb-4">{m.coding_activity()}</h2>
  <div
    class="overflow-x-auto bg-mocha-base border border-mocha-surface1 border-t-mocha-surface2 rounded-md shadow-mocha-crust shadow-sm p-4"
  >
    {#if loading}
      <div class="flex items-center justify-center h-[161px]">
        <div class="text-mocha-subtext0 text-sm">Loading heatmap...</div>
      </div>
    {:else if error}
      <div class="flex items-center justify-center h-[161px]">
        <a
          href="https://heatmap.shymike.dev/?id=29100&timezone=Europe%2FParis&cell_size=15&rounding=100&labels=true&theme=catppuccin_dark&standalone=true"
          target="_blank"
          rel="noopener noreferrer"
          class="text-mocha-subtext0 hover:text-mocha-blue text-sm transition-colors duration-200"
        >
          View heatmap on heatmap.shymike.dev
        </a>
      </div>
    {:else}
      <div class="heatmap-svg w-full">
        {@html svgContent}
      </div>
    {/if}
  </div>
</section>

<style>
  .heatmap-svg :global(svg) {
    width: 100%;
    height: auto;
  }
</style>
