# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Svelte MCP Server

You have access to the Svelte MCP server with comprehensive Svelte 5 documentation (islands here use Svelte 5 runes):

1. **list-sections**: Use FIRST to discover available documentation sections
2. **get-documentation**: Retrieve full documentation content
3. **svelte-autofixer**: MUST be used whenever writing Svelte code before sending to user. Keep calling until no issues remain
4. **playground-link**: Only after user confirmation, never for code written to project files

## Commands

```bash
npm run dev              # Dev server (proxies /api → localhost:8000)
npm run build            # Static production build → dist/
npm run preview          # Preview production build
npm run check            # astro check (type checking)
npm run format           # Prettier write
npm run lint             # Prettier check
```

## Architecture

### Technology Stack

- **Framework**: Astro 5, `output: 'static'`, fully prerendered
- **Islands**: Svelte 5 (runes mode) via @astrojs/svelte — only interactive parts hydrate
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Catppuccin Mocha theme in `src/styles/global.css` (`@theme` block)
- **Markdown**: Astro content collections + built-in Shiki (`catppuccin-mocha`), custom `remarkAlerts` plugin (GitHub-style `> [!NOTE]` callouts)
- **Deploy**: Docker (nginx) via `compose.yml`; CI builds images in `.forgejo/workflows/ci.yml` (Forgejo Actions)

### i18n — path-based

- English = default locale, **unprefixed** (`/`, `/projects/icarus`). French under `/fr/` (`/fr/projects/icarus`).
- Astro `i18n` config in `astro.config.mjs` (`prefixDefaultLocale: false`).
- Translations: `src/i18n/en.json` + `fr.json`, typed `useT(locale)` from `src/i18n/index.ts`. Helpers: `localizePath(path, locale)`, `stripLocale(pathname)`, `ogLocale(locale)`.
- Every page = shared template in `src/page-templates/*.astro` (takes `locale` prop) + thin wrappers in `src/pages/...` and `src/pages/fr/...`. Adding a page means: template + 2 wrappers.
- `LangSwitch.svelte` island maps current path to the other locale, sets `locale` cookie + `sessionStorage.locale_switching` flag (suppresses the Map fly-in), full navigation.

### Content Collections

- Markdown in `src/content/posts/` and `src/content/projects/`, named `{slug}.{locale}.md` (`en`/`fr`).
- `src/content.config.ts`: glob loaders with **custom `generateId` that keeps the raw filename** — the default slugifies `codebot.en` into `codeboten` and breaks locale parsing. Do not remove.
- `src/lib/collections.ts`: `getPosts(locale)` / `getProjects(locale)` (filtered + date-sorted, with `readingTime`), `parseId`, `extractTags`, `toPostMeta`/`toProjectMeta` (JSON-safe props for islands).
- Slug pages: `getStaticPaths` per locale passes `{post/project, prev, next}` as props; content rendered with `render(entry)` from `astro:content`.
- Frontmatter: `title, date, description, tags[], published` (+ projects: `featured, github, demoUrl, status`).

### Components

- `src/components/*.astro`: static chrome (Navbar, Footer, SEO, JsonLd, Tooltip). `ProjectCard.svelte`/`PostCard.svelte` are Svelte but render statically (no `client:` directive = zero JS).
- `src/components/islands/*.svelte`: hydrated islands. Islands receive **serializable props only** (use `*Meta` types + label strings — no functions, no Dates).
  - `Map.svelte` (`client:visible`): MapLibre GL, MapTiler style JSON from `src/lib/styles/` with `USE_KEY_PARAMETER` replaced by `import.meta.env.PUBLIC_MAPTILER_API_KEY`. **maplibre CSS is imported inside this island — never move it to global.css** (costs ~150–290ms FCP on every content page). Compact attribution ⓘ is force-collapsed on load.
  - `ProjectsExplorer` / `PostsExplorer` (`client:load`): search (local state) + tags/page/featured in URL params via `history.replaceState` + `popstate`. Reuse `src/lib/content.ts` utils.
  - `Education.svelte` (`client:load`): work/education toggle, measured-height animation.
  - `ContactForm.svelte` (`client:visible`): POSTs JSON to `/api/contact` (external FastAPI+ntfy, `services/contact-proxy`).
  - `TableOfContents.svelte` (`client:idle`): IntersectionObserver active-heading tracking.

### SEO

- `SEO.astro`: title/description/canonical, og:* (+ site_name, default `/og-default.png`), twitter cards, hreflang en/fr/x-default, RSS alternates, `article:published_time`/`article:tag` for articles. Props take the **locale-less path**; it localizes internally.
- `JsonLd.astro`: Person (home), BlogPosting (posts), SoftwareSourceCode (projects), BreadcrumbList (slug pages).
- `@astrojs/sitemap` with i18n → `sitemap-index.xml` (referenced in `public/robots.txt`). RSS per locale: `src/pages/rss.xml.ts` + `src/pages/fr/rss.xml.ts`.

### View Transitions

- `<ClientRouter />` in `BaseLayout.astro`; `<main transition:name="page">`.
- Directional slide: route order `/`→`/projects`→`/posts`→`/contact` (left/right), slug pages come from bottom. The `astro:before-preparation` listener computes direction into `html[data-nav]`; **it must be re-applied in `astro:after-swap`** because the swap replaces `<html>` attributes. CSS keyframes in `global.css` (`::view-transition-*`), reduced-motion guarded.
- `transition:persist` lives on Navbar's `<header>` element — putting it on a component tag is silently ignored.
- Home stagger animation: `.stagger` class + `--d` delay CSS vars (content is static HTML, SEO-visible without JS).

### Styling

**See DESIGN_SYSTEM.md for complete design system documentation.**

- Catppuccin Mocha palette in `src/styles/global.css` `@theme` block (`--color-mocha-*`).
- Base interactive element: `bg-mocha-base border border-mocha-surface1 border-t-mocha-surface2 rounded-md shadow-mocha-crust shadow-sm transition-colors duration-200 hover:border-mocha-blue active:bg-mocha-surface0`.
- MapLibre control/popup overrides in `global.css` need the `.maplibregl-ctrl` prefix for specificity — maplibre's own CSS loads after global.css (bundled with the island).

### nginx / Deploy

- `nginx.conf`: no-cache on HTML **including `location /`** (the `\.html$` regex never matches directory-index URLs), immutable `/_astro/`, `error_page 404 /404.html`, 301 `/en/*` → `/*`, `/api/contact` proxied to the `contact-proxy` service.
- Standalone `docker run` of the image needs `--add-host contact-proxy:127.0.0.1` or nginx exits at startup (upstream DNS). Fine under compose.
- `PUBLIC_MAPTILER_API_KEY` baked at build time (Docker build-arg / `.env`).
