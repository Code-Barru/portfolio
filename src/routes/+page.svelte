<script lang="ts">
  import { onMount } from 'svelte';
  import Map from '$lib/components/Map.svelte';
  import Tooltip from '$lib/components/Tooltip.svelte';
  import Education from '$lib/components/Education.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import PostCard from '$lib/components/PostCard.svelte';
  import type { MapMarker, TechStackItem } from '$lib/types';
  import type { PageData } from './$types';
  import { SiDebian, SiDocker, SiGithub, SiPostgresql, SiRust, SiSvelte, SiTypescript } from '@icons-pack/svelte-simple-icons';
  import { m } from '$lib/paraglide/messages';
  import { getLocale } from '$lib/paraglide/runtime';
	import { FileText, Mail } from '@lucide/svelte';
	import PlaceHolder from '$lib/components/PlaceHolder.svelte';
	import CodingHeatmap from '$lib/components/CodingHeatmap.svelte';
  import { staggerFadeIn } from '$lib/transitions';

  let { data }: { data: PageData } = $props();

  const currentLocale = getLocale();
  const baseUrl = 'https://antoineousselin.fr';

  const location: [number, number] = [3.0573, 50.6320];

  const marker: MapMarker = {
    position: location,
    color: '#89b4fa',
    popup: {
      title: 'Lille',
    }
  };

	function calculateAge(birthDate: string) {
		const birth = new Date(birthDate);
		const today = new Date();
		let age = today.getFullYear() - birth.getFullYear();
		const monthDifference = today.getMonth() - birth.getMonth();
		const dayDifference = today.getDate() - birth.getDate();

		if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
			age--;
		}

		return age;
	}

	let age: number = calculateAge('2002-10-07');
  let techStackItems: TechStackItem[] = [
    {
      icon: SiRust,
      color: "hover:text-mocha-peach",
      link: "https://rust-lang.org",
      title: "Rust"
    },
    {
      icon: SiTypescript,
      color: "hover:text-mocha-blue",
      link: "https://www.typescriptlang.org/",
      title: "Typescript"
    },
    {
      icon: SiSvelte,
      color: "hover:text-mocha-peach",
      link: "https://svelte.dev/",
      title: "SvelteKit"
    },
    {
      icon: SiDocker,
      color: "hover:text-mocha-blue",
      link: "https://docker.com",
      title: "Docker"
    },
    {
      icon: SiDebian,
      color: "hover:text-mocha-red",
      link: "https://www.debian.org",
      title: "Debian"
    },
    {
      icon: SiPostgresql,
      color: "hover:text-mocha-blue",
      link: "https://www.postgresql.org/",
      title: "Postgresql"
    },
  ];

  let mounted = $state(false);
  let prefersReducedMotion = $state(false);

  let displayProjects = $derived.by(() => {
    const localeProjects = data.projects.filter(p => p.locale === currentLocale);

    const sorted = [...localeProjects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return sorted.slice(0, 2);
  });

  let displayPosts = $derived.by(() => {
    return data.posts
      .filter(p => p.locale === currentLocale)
      .slice(0, 2);
  });

  onMount(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mediaQuery.matches;

    mounted = true;
  });
</script>

<svelte:head>
  <title>{m.seo_home_title()}</title>
  <meta name="description" content={m.seo_home_description()} />

  <link rel="canonical" href={baseUrl} />

  <meta property="og:title" content={m.seo_home_title()} />
  <meta property="og:description" content={m.seo_home_description()} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={baseUrl} />
  <meta property="og:locale" content={currentLocale === 'fr' ? 'fr_FR' : 'en_US'} />

  <link rel="alternate" hreflang="en" href="{baseUrl}/en" />
  <link rel="alternate" hreflang="fr" href="{baseUrl}/fr" />
  <link rel="alternate" hreflang="x-default" href={baseUrl} />
</svelte:head>

<div class="my-2 md:mt-10 md:mb-3">
  {#if mounted}
  <div
    class="relative w-full mx-auto h-40 md:h-60 overflow-hidden"
    in:staggerFadeIn={{ duration: 1000, delay: 0 }}
  >
    <Map
      center={location}
      zoom={12}
      {marker}
      height="h-40 md:h-60"
      class="shadow-lg w-full object-cover"
      enableTraveling={true}
    />
    <div
      class="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-mocha-base via-mocha-base/90 to-transparent">
    </div>
  </div>
  {/if}

  <div class="flex flex-col-reverse mt-3 items-start md:flex-row md:h-72 justify-between">
    {#if mounted}
		<div
      class="flex flex-col md:max-w-3/5 h-full grow"
      in:staggerFadeIn={{ duration: 1000, delay: prefersReducedMotion ? 0 : 150 }}
    >
      <div class="flex flex-col">
        <div class="text-mocha-subtext0 font-bold text-xl">{m.hi_text()}</div>
        <h1 class="text-mocha-blue font-bold text-4xl">Antoine Ousselin</h1>
        <div class="mt-2">
          {m.whoami({age})}<br />
          {m.whatido()}
          <strong class="text-mocha-blue">Rust</strong>.
        </div>
        <div class="flex mt-3 flex-row gap-3">
          {#each techStackItems as item (item.title)}
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              class="tech-icon text-mocha-subtext0 transition-all duration-200 {item.color} hover:scale-110"
            >
              <Tooltip text={item.title}>
                <item.icon title="" size={25} />
              </Tooltip>
            </a>
          {/each}
        </div>
      </div>
      <div class="flex mt-4 gap-2">
        <a
          href="/resume.pdf"
          target="_blank"
          class="flex cursor-pointer items-center text-lg gap-2 px-4 py-2 bg-mocha-base border border-mocha-surface1 hover:border-mocha-blue active:bg-mocha-surface0 transition-colors duration-200 text-mocha-text rounded-md shadow-mocha-crust shadow-sm border-t-mocha-surface2"
        >
          {m.resume()}
          <FileText size={24} />
        </a>
          <a href="https://github.com/Code-Barru" target="_blank" class="flex cursor-pointer hover:text-mocha-blue transition-colors duration-200 items-center mx-1 py-1">
            <Tooltip text="Code-Barru" position="bottom">
              <SiGithub title="" size={24} />
            </Tooltip>
          </a>
          <a href="/contact" class="flex cursor-pointer hover:text-mocha-blue transition-colors duration-200 items-center mx-1 py-1">
            <Mail size={24} />
          </a>
      </div>
    </div>
    {/if}

    <!-- {#if mounted} -->
    <!-- <div in:staggerFadeIn={{ duration: 1000, delay: prefersReducedMotion ? 0 : 300 }}> -->
    <!--   <PlaceHolder customClass="hidden md:flex" width={120} height={160} /> -->
    <!--   <PlaceHolder customClass="md:hidden" width={125} height={200} /> -->
    <!-- </div> -->
    <!-- {/if} -->
  </div>
  
  {#if mounted}
  <div class="relative mt-6 md:mt-0" in:staggerFadeIn={{ duration: 1000, delay: prefersReducedMotion ? 0 : 350 }}>
    <Education />
  </div>
  {/if}

  {#if mounted}
    <div class="mt-8" in:staggerFadeIn={{duration: 1000, delay: prefersReducedMotion ? 0 : 500 }}>
      <CodingHeatmap />
    </div>
  {/if}

  {#if mounted && displayProjects.length > 0}
  <div in:staggerFadeIn={{ duration: 1000, delay: prefersReducedMotion ? 0 : 650 }}>
    <section class="mt-12">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-3xl font-bold text-mocha-blue">{m.projects_name()}</h2>
        <a
          href="/projects"
          class="flex items-center gap-1 text-sm text-mocha-subtext0 hover:text-mocha-blue transition-colors duration-200"
        >
          {m.view_all()} →
        </a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each displayProjects as project (project.slug)}
          <ProjectCard {project} />
        {/each}
      </div>
    </section>
  </div>
  {/if}

  {#if mounted && displayPosts.length > 0}
  <div in:staggerFadeIn={{ duration: 1000, delay: prefersReducedMotion ? 0 : 800 }}>
    <section class="mt-12">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-3xl font-bold text-mocha-blue">{m.blog_name()}</h2>
        <a
          href="/posts"
          class="flex items-center gap-1 text-sm text-mocha-subtext0 hover:text-mocha-blue transition-colors duration-200"
        >
          {m.view_all()} →
        </a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each displayPosts as post (post.slug)}
          <PostCard {post} />
        {/each}
      </div>
    </section>
  </div>
  {/if}
</div>
