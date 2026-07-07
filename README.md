# Portfolio

Personal portfolio — [antoineousselin.fr](https://antoineousselin.fr). Built with [Astro 5](https://astro.build), Svelte 5 islands, Tailwind CSS v4 (Catppuccin Mocha).

## Developing

```sh
npm install
npm run dev
```

The contact form proxies `/api` to `http://localhost:8000` in dev (see `services/contact-proxy`).

## Building

```sh
npm run build      # static output in dist/
npm run preview    # serve the production build locally
npm run check      # astro check (types)
```

## Deploying

```sh
docker compose up -d --build
```

Builds the static site into an nginx image (`Dockerfile`), plus the FastAPI contact proxy and ntfy. Requires `PUBLIC_MAPTILER_API_KEY` in `.env`.

## Content

Markdown in `src/content/posts` and `src/content/projects`, named `{slug}.{locale}.md` (`en`/`fr`). English pages live at `/`, French at `/fr/`.
