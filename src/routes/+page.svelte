<script lang="ts">
  import Map from '$lib/components/Map.svelte';
  import Tooltip from '$lib/components/Tooltip.svelte';
  import type { MapMarker, TechStackItem } from '$lib/types';
  import { SiDebian, SiDocker, SiGithub, SiPostgresql, SiRust, SiSvelte, SiTypescript } from '@icons-pack/svelte-simple-icons';
  import { m } from '$lib/paraglide/messages';
	import { FileText, Mail } from '@lucide/svelte';
	import PlaceHolder from '$lib/components/PlaceHolder.svelte';

  // Lille, France
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
</script>


<div class="my-2 md:my-10">
  <div class="relative w-full mx-auto h-40 md:h-60 overflow-hidden">
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

  <div class="flex flex-col-reverse mt-3 items-start md:flex-row md:h-72 justify-between">
		<div class="flex flex-col md:max-w-3/5 h-full grow">
      <div class="flex flex-col">
        <div class="text-mocha-subtext0 font-bold text-xl">{m.hi_text()}</div>
        <div class="text-mocha-blue font-bold text-4xl">Antoine Ousselin</div>
        <div class="mt-2">
          {m.whoami({age})}<br />
          {m.whatido()}
          <strong class="text-mocha-blue">Rust</strong>.
        </div>
        <div class="flex mt-3 flex-row gap-3">
          {#each techStackItems as item}
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
        <button 
          class="flex cursor-pointer items-center text-lg gap-2 px-4 py-2 bg-mocha-surface0 hover:bg-mocha-surface1 active:bg-mocha-surface2 transition-colors duration-200 text-mocha-subtext1 active:text-mocha-text rounded-md shadow-mocha-crust shadow-sm border-t border-t-mocha-surface2"
        >
          {m.resume()}
          <FileText size={24} />
        </button>
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
      <PlaceHolder customClass="hidden md:flex" width={120} height={160} />
      <PlaceHolder customClass="md:hidden" width={125} height={200} />
  </div>
</div>
