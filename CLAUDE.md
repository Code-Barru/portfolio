# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Svelte MCP Server

You have access to the Svelte MCP server with comprehensive Svelte 5 and SvelteKit documentation:

### Available MCP Tools

1. **list-sections**: Use FIRST to discover available documentation sections with titles, use_cases, and paths
2. **get-documentation**: Retrieve full documentation content (accepts single or multiple sections). After calling list-sections, analyze the use_cases field and fetch ALL relevant sections
3. **svelte-autofixer**: Analyzes Svelte code and returns issues/suggestions. MUST be used whenever writing Svelte code before sending to user. Keep calling until no issues remain
4. **playground-link**: Generates Svelte Playground link. Only call after user confirmation and NEVER if code was written to project files

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --open    # Start dev server and open browser

# Building
npm run build            # Create production build
npm run preview          # Preview production build

# Code Quality
npm run check            # Type check with svelte-check
npm run check:watch      # Type check in watch mode
npm run lint             # Run prettier check + eslint
npm run format           # Format code with prettier
```

## Architecture

### Technology Stack
- **Framework**: SvelteKit with Svelte 5 (runes mode)
- **Styling**: Tailwind CSS v4 with Catppuccin Mocha theme
- **Content**: MDSvex for markdown with Shiki syntax highlighting
- **i18n**: Inlang Paraglide (locales: `en`, `fr`)
- **Static Generation**: adapter-static for prerendering

### Content Management System

**Posts and Projects are stored as Markdown files** with frontmatter:
- **Posts**: `/src/posts/*.md` (e.g., `welcome.en.md`, `welcome.fr.md`)
- **Projects**: `/src/projects/*.md` (e.g., `codebot.en.md`, `codebot.fr.md`)

Naming convention: `{slug}.{locale}.md` where locale is `en` or `fr`.

**Frontmatter structure:**
```markdown
---
# Posts
title: "Post Title"
date: "2024-12-20"
description: "Post description"
tags: ["tag1", "tag2"]
published: true
locale: "en"

# Projects (additional fields)
featured: true
github: "https://github.com/..."
demoUrl: "https://demo.example.com"
status: "completed" | "in-progress" | "archived"
---
```

**Content loading flow:**
1. `+page.server.ts` uses `loadPosts()`/`loadProjects()` from `src/lib/utils/content.server.ts`
2. These functions use `import.meta.glob()` to load markdown files eagerly
3. Frontmatter is extracted to TypeScript interfaces (`Post`, `Project` from `src/lib/types.ts`)
4. Client-side filtering by locale happens in `+page.svelte` using `getLocale()`

### Internationalization (i18n)

**Inlang Paraglide** manages translations:
- **Config**: `project.inlang/settings.json` (baseLocale: `en`, locales: `['en', 'fr']`)
- **Messages**: `messages/{locale}.json` (e.g., `messages/en.json`, `messages/fr.json`)
- **Usage in components**:
  ```svelte
  import { m } from '$lib/paraglide/messages';
  import { getLocale } from '$lib/paraglide/runtime';

  const currentLocale = getLocale(); // 'en' | 'fr'
  {m.nav_home()} // Translated text
  ```

**Locale switching**: Handled by `LangSwitch.svelte` component which updates session storage and reloads.

### Page Transitions

Custom page transition system in `src/routes/+layout.svelte`:
- **Direction calculation**: Based on route order (`/` → `/projects` → `/posts` → `/contact`)
- **Transitions**: `pageTransition()` from `src/lib/transitions.ts` using Svelte's `fly` transition
- **beforeNavigate** hook calculates direction (`left`, `right`, `bottom`) for smooth navigation

### Styling System

**See DESIGN_SYSTEM.md for complete design system documentation.**

Key principles:
- **Catppuccin Mocha** color palette (defined in `src/app.css` using `@theme`)
- **Minimaliste**: `bg-mocha-base` as primary background
- **3D effect**: `border-t-mocha-surface2` for subtle depth
- **Mobile-first**: All components designed for mobile first

**Base interactive element styles:**
```css
bg-mocha-base
border border-mocha-surface1
border-t-mocha-surface2
rounded-md
shadow-mocha-crust shadow-sm
transition-colors duration-200
hover:border-mocha-blue
active:bg-mocha-surface0
```

**Button variants** (see DESIGN_SYSTEM.md):
- Primary (blue): Call-to-action buttons
- Secondary: Default buttons
- Mini-buttons: Card actions
- Toggle buttons: Filters with active/inactive states
- Tag filters: `rounded-full` pills

### MDSvex Configuration

**Syntax highlighting** with Shiki (configured in `svelte.config.js`):
- **Themes**: `catppuccin-mocha`, `catppuccin-latte`
- **Languages**: `javascript`, `rust`, `sh`, `shell`, `toml`, `cpp`
- **Custom plugin**: `remarkAlerts` for alert/callout boxes

**Extensions**: `.svelte`, `.svx`, `.md` (configured in `svelte.config.js`)

### Key Utilities

**`src/lib/utils/content.server.ts`** (server-side only):
- `loadPosts(locale?)`: Load all posts for a locale
- `loadProjects(locale?)`: Load all projects for a locale
- `extractTags()`: Extract unique tags from posts/projects
- `calculateReadingTime(content)`: Calculate reading time (200 words/min)

**`src/lib/utils/content.ts`** (client-side):
- `searchItems(items, query)`: Filter items by search query
- `filterByTags(items, tags)`: Filter items by selected tags
- `paginateItems(items, page, perPage)`: Paginate items

**`src/lib/types.ts`**: All TypeScript interfaces for the project.

### Route Structure

```
src/routes/
├── +layout.svelte              # Root layout with Navbar, transitions
├── +page.svelte                # Home page (bio, education timeline)
├── projects/
│   ├── +page.server.ts         # Load all projects
│   ├── +page.svelte            # Projects list with search/filter/pagination
│   └── [slug]/+page.svelte     # Individual project page (dynamic)
├── posts/
│   ├── +page.server.ts         # Load all posts
│   ├── +page.svelte            # Posts list with search/filter/pagination
│   └── [slug]/+page.svelte     # Individual post page (dynamic)
└── contact/
    └── +page.svelte            # Contact form
```

**Dynamic routes** (`[slug]`):
- Load markdown content using `import.meta.glob()` in component script
- Match slug against filename (without locale extension)
- Render mdsvex component from `module.default`

### Component Library

**Key components** in `src/lib/components/`:
- **Navbar.svelte**: Navigation with active route highlighting
- **LangSwitch.svelte**: Language toggle (en/fr)
- **Education.svelte**: Timeline with Work/Education toggle (animated height)
- **Timeline.svelte**: Reusable timeline component
- **ProjectCard.svelte**: Project card with featured badge, tags, action buttons
- **PostCard.svelte**: Post card with terminal-style design
- **Map.svelte**: Interactive map using MapLibre GL
- **Tooltip.svelte**: Reusable tooltip component

### State Management

**Svelte 5 runes** used throughout:
- `$state`: Reactive state (replaces `let` with reactivity)
- `$derived`: Computed values (replaces `$:`)
- `$effect`: Side effects (replaces `$:` for effects)
- `$props`: Component props (replaces `export let`)

**URL state** for filtering/pagination:
- Search params managed via `$page.url.searchParams`
- `updateParams()` function to update URL without navigation
- `goto()` with `replaceState: true` for smooth updates

### Important Patterns

**Locale filtering** (client-side):
```svelte
const currentLocale = getLocale();
let filteredItems = $derived(
  data.items.filter(item => item.locale === currentLocale)
);
```

**Search + Filter + Pagination**:
```svelte
let searchQuery = $state('');
let selectedTags = $derived($page.url.searchParams.get('tags')?.split(',') || []);
let currentPage = $derived(Number($page.url.searchParams.get('page')) || 1);

let filtered = $derived.by(() => {
  let result = data.items.filter(i => i.locale === currentLocale);
  result = searchItems(result, searchQuery);
  result = filterByTags(result, selectedTags);
  return result;
});

let paginated = $derived(paginateItems(filtered, currentPage, ITEMS_PER_PAGE));
```

**Dynamic height animation** (Education.svelte):
- Hidden measurement divs with `invisible absolute pointer-events-none`
- `tick()` to wait for DOM updates before measuring `offsetHeight`
- `$effect` to reactively update height on state changes

## Development Notes

- **Svelte 5 async components**: Enabled via `svelte.config.js` experimental flag (`async: true`)
- **Prerendering**: All routes prerendered via adapter-static (`entries: ['*']`)
- **HTTP errors**: Set to `'warn'` in prerender config to avoid build failures
- **No TypeScript in markdown**: MDSvex doesn't support TypeScript in script blocks
- **Icon libraries**: `@lucide/svelte` for UI icons, `@icons-pack/svelte-simple-icons` for brand icons
