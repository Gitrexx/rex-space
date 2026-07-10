# CLAUDE.md

Repo orientation for **Rex Space** — Rex's personal site. This file explains how the
repo is organized so you can work in it quickly. For task-specific how-tos, defer to the
template author's guides in [`.claude/rules/`](.claude/rules/) (they are loaded as project
instructions and are authoritative for prose, styling, MDX, and setup).

## What this is

A static site built with **Astro 6** on the **Tone** theme (`hanityx/astro-tone`): a
typography-first blog starter with quiet defaults, dark mode, RSS, sitemap, and built-in
search. Rex is turning it into a personal site with four kinds of content:

1. **CV** — the config-driven **About** page.
2. **Blog** — tech write-ups, thoughts, and sci-fi stories.
3. **Projects** — intro + details + external link + optional interactive demos.
4. **Learning materials** — notes and references, static or interactive.

**Key architectural fact:** there is a **single content collection, `posts`**. So the
blog, projects, and learning notes are all currently modeled as posts distinguished by
`category` — there is no separate `/projects` route or `projects` collection yet. The CV
is not a post at all; it is rendered from the `about` block in `astro-theme-config.ts`.
If a task needs a genuinely distinct section (its own route, schema, or index), that has
to be **built** — it does not exist today.

## Stack

- **Astro 6**, static output, TypeScript.
- **Markdown + MDX** posts (`@astrojs/mdx`). MDX is the path to interactive/component-driven content.
- **Pagefind** search — the index is generated from `dist/` during `npm run build`, not at dev time.
- **Expressive Code** for code blocks; palette/config in `src/config/expressive-code.ts` (kept separate from the design tokens on purpose).
- **sharp** + Astro's asset pipeline for responsive images (AVIF/WebP, dimensions emitted).
- **RSS** (`@astrojs/rss`), **sitemap** (`@astrojs/sitemap`), and a table-of-contents rail (`toc-rail`).
- No UI framework. A little vanilla TS in `src/scripts/`, mounted via `src/scripts/mount.ts`.

## Commands

Node **22.12+** (see `.nvmrc`).

| Command            | Action                                          |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Dev server at `http://localhost:4321`           |
| `npm run build`    | `astro build` + `pagefind --site dist`          |
| `npm run preview`  | Serve the built `dist/`                         |
| `npm run check`    | Astro type checks                               |
| `npm run lint`     | ESLint                                          |
| `npm run lint:css` | Stylelint                                       |
| `npm run format`   | Prettier                                        |

Search only works against a production build (`npm run build && npm run preview`), because
Pagefind indexes the emitted `dist/`. Per `.claude/AGENTS.md`, the dev server can be run in
background mode: `astro dev --background`, managed with `astro dev stop|status|logs`.

## Layout

```text
astro-theme-config.ts   The one config file for site-wide settings (see below)
astro.config.mjs        Astro integrations, markdown rehype plugins, base/site resolution
src/
  content.config.ts     The `posts` collection + Zod frontmatter schema
  consts.ts             Re-exports site meta from astro-theme-config.ts
  ui.ts                 Shared UI strings (button labels, hero copy, empty states)
  config/               expressive-code.ts (code-block theme)
  content/posts/        The posts — Markdown/MDX; filename = URL slug
  data/                 quotes.ts — rotating quotes for the home hero
  pages/                Routes (see below)
  layouts/              BaseLayout.astro, PostLayout.astro
  components/           Header, Footer, PostFeed, SearchPalette, FeaturedPostGrid, etc.
  scripts/              Client-side behavior (search, lightbox, scroll focus, TOC rail)
  styles/               tokens.css (design knobs) + prose/page/layout/component CSS
  assets/               Images and fonts, processed at build time
  utils/                paths.ts (withBase), serialize-script-json.ts
public/                 Static passthrough (favicons, og.png, giscus themes)
.claude/rules/          Template author's guides — treat as authoritative how-tos
```

## Configuration: `astro-theme-config.ts`

This is the single source of truth for site-wide settings, and most customization should
happen here before touching components:

- `site` — url, base, title, `logoLabel`, description, author, default OG image, locale.
- `nav` / `footerNav` — header and footer links (currently Posts / About / Search).
- `content.categoryOrder` — the ordered category list that drives the `/posts` filter row.
- `comments` — giscus config, `mode: 'off'` by default.
- `social` — GitHub / website / LinkedIn / email (feed the About page links).
- `about` — the **entire CV**: name, role, location, focus, hero `tags`, summary, plus `experience` / `education` / `skills` / `awards` / `languages` arrays.

`src/consts.ts` re-exports the site meta; `src/ui.ts` holds visible UI strings. Copy lives
in config / `ui.ts`, visual primitives live in `src/styles/tokens.css` — keep that split.

The `social` and `about` blocks now hold Rex's real details — the About page renders his
full CV. **Still placeholder, to replace before publishing:** `site.url`
(`https://example.com`), `site.description` (dummy text), and `site.logoLabel`.

## Content model

Every post is validated against the schema in `src/content.config.ts`:

| Field           | Type / values          | Purpose                                                        |
| --------------- | ---------------------- | -------------------------------------------------------------- |
| `title`         | string (required)      | Post title (page `h1`)                                         |
| `description`   | string (required)      | Cards, search, social previews                                 |
| `pubDate`       | date (required)        | Publish date; drives ordering                                  |
| `updatedDate`   | date (optional)        | Shows an "Updated" note                                        |
| `heroImage`     | image (optional)       | Card thumb, social metadata, structured data                  |
| `category`      | string (optional)      | Filter row on `/posts`; should exist in `content.categoryOrder`|
| `homeFeatured`  | boolean (default false)| Pins the large feature card on the home page                  |
| `homeHeroOrder` | positive int (optional)| Pins one of the two compact hero links on the home page       |
| `homeOrder`     | positive int (optional)| Pins a slot in the 3-card home grid                           |
| `focusEffect`   | `'scroll-dark'`        | Optional scroll-dark reading effect                           |
| `draft`         | boolean (default false)| Excludes the post from build, RSS, and search                 |

How the home page (`src/pages/index.astro`) consumes these: two **selected-post** links in
the hero (`homeHeroOrder`), one **featured** card (`homeFeatured`, else newest), and a
**3-card grid** (`homeOrder`). Any unpinned slots fill by `pubDate`, newest first. The hero
also shows a fixed `heroTitle` (a const in `index.astro`) and a **daily rotating quote** from
`src/data/quotes.ts` — the index is derived from the local date, and a no-flash inline script
re-picks it per viewer. Edit that file to change the quotes.

## Routes (`src/pages/`)

- `index.astro` — home: hero (title + daily rotating quote + selected-post links), one featured card, and a 3-card grid, all from posts.
- `posts/index.astro` — `/posts`: category filter row + inline list search.
- `posts/[...slug].astro` — individual post via `PostLayout` (reading time, related posts, TOC rail, optional scroll-dark).
- `about.astro` — `/about`: the full CV (summary, experience, education, skills, recognition, languages), rendered from `config.about` and styled in `src/styles/pages/about.css`.
- `search.astro` — `/search`: full-text search (Pagefind). Also `Cmd`/`Ctrl` + `K` command palette everywhere.
- `404.astro`, `rss.xml.js`, `robots.txt.js`.

## Styling

Token-first. Change the look from **`src/styles/tokens.css`** — core colors, the 4pt
spacing scale, and the type scale. Components read those variables rather than raw values.
Page/layout/component CSS lives under `src/styles/{pages,layouts,components}`. The code-block
palette (`code.css`, `src/config/expressive-code.ts`) is deliberately kept out of the token
system. Full guidance is in `.claude/rules/styling-design.md`.

## What's been customized from the template

- **Home hero** (`src/pages/index.astro`, `styles/pages/home.css`) — the template's tagline + description were replaced with a fixed title and a daily rotating quote; the quote list lives in `src/data/quotes.ts`.
- **About / CV** (`src/pages/about.astro`, `styles/pages/about.css`) — extended beyond the template's generic `career` / `interests` slots to render experience, education, skills, recognition, and languages from `config.about`.
- **Footer** (`src/components/Footer.astro`) — copyright reads `© {year} {site.author}. Based on astro-tone. MIT Licensed.`

## Conventions & gotchas

- **Prose starts at `##`** — the page title is the only `h1`. See `.claude/rules/markdown-reference.md` for every element the theme styles (callouts, `<kbd>`, `<mark>`, footnotes, tables, images/lightbox).
- **Categories** must be in `content.categoryOrder` to sort correctly in the filter row (the current dummy post uses `'Misc'`, which is not yet listed — add real categories as content grows).
- **Interactive content = MDX** importing an Astro/framework component — the mechanism for project demos and learning widgets (`.claude/rules/when-to-use-mdx.mdx`).
- **Internal links** should go through `withBase()` (`src/utils/paths.ts`) so they respect `site.base` under subpath deploys.
- The old `AGENTS.md` (which the root `CLAUDE.md`/`README.md` symlinked to) was removed; both are now real files.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)