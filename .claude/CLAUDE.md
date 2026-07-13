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
4. **Learning materials** — the config-driven **Learning** page: a searchable card directory of external study sites, each embedded as an iframe on its own detail page.

**Key architectural fact:** there is a **single content collection, `posts`**. The blog
lives there. Three sections are **not posts at all** — they render from
`astro-theme-config.ts`: the CV from the `about` block, **Learning** from the `learning`
block, and **Projects** from the `projects` block (see Routes below). Projects are a
config-driven card directory that mirrors Learning — there is **no** `projects` collection.
If a task needs another genuinely distinct section (its own route, schema, or index), that
has to be **built** — pattern-match on how `about` / `learning` / `projects` are wired.

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
- `nav` / `footerNav` — header and footer links (currently Posts / Projects / Learning / About / Search).
- `content.categoryOrder` — the ordered category list that drives the `/posts` filter row.
- `comments` — giscus config, `mode: 'off'` by default.
- `social` — GitHub / website / LinkedIn / email (feed the About page links).
- `about` — the **entire CV**: name, role, location, focus, hero `tags`, summary, plus `experience` / `education` / `skills` / `awards` / `languages` arrays.
- `learning` — the **Learning page**: `eyebrow` / `title` / `intro` copy plus an `items` array (`slug`, `title`, `description`, `url`, optional `tag`). Each item is an external site embedded as an iframe; cards are grouped by `tag`. Add an item to add a topic — no component edits needed.
- `projects` — the **Projects page**: `eyebrow` / `title` / `intro` copy plus an `items` array (`slug`, `title`, `description`, optional `tag` / `url` / `urlLabel` / `details` / `stack` / `demo`). Mirrors `learning` — cards grouped by `tag` open a detail page showing the intro, `details` prose, `stack` chips, an external link, and an optional `demo` iframe. Add an item to add a project — no component edits needed.

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

### Writing a new post

When creating a post, don't ship it text-only:

- **Always generate a hero image.** Use the `generate-image` skill (OpenAI `gpt-image-1`)
  to make a cover from the post's content, save it to `src/assets/<slug>.png`, and wire it
  in with `heroImage: '../../assets/<slug>.png'`. Match the site's look — dark background,
  soft bloom, minimal, no text labels — and vary the palette/motif to fit the post. The
  existing post covers (`k8s-mock-exam`, `service-switch`, etc.) are the reference for tone.
- **Optionally add an inline SVG** where the content genuinely benefits from a diagram
  (architecture, a flow, a before/after). This is opt-in — only when it earns its place, not
  decoration. Inline SVG can go straight in the Markdown/MDX body; keep it theme-aware
  (stroke/fill via `currentColor` or token-driven values so it reads in light and dark).

### Editing an existing post

When changing a post that is already published, pick the treatment by the size of the change:

- **Small / one-off fix** (typo, broken link, a clarified sentence): just set or bump the
  `updatedDate` frontmatter field to the edit date. The theme renders an "Updated" note from
  it — that is the whole record. Nothing else to add.
- **Living post** (a piece you expect to revise or extend repeatedly — a running guide, an
  evolving write-up): keep `updatedDate` current **and** maintain an in-body changelog — a
  `## Changelog` section at the end of the body with dated bullets (newest first, e.g.
  `- 2026-07-13 — added the X section`) so readers can see what changed over time.

In both cases, **leave `pubDate` alone** — it is the canonical sort key for the home page,
`/posts`, and RSS. Bumping it on an edit yanks an old post back to the top, which reads as
dishonest; `updatedDate` is the field for "this was touched later." Git history is the
complete diff-level record underneath both approaches.

## Routes (`src/pages/`)

- `index.astro` — home: hero (title + daily rotating quote + selected-post links), one featured card, and a 3-card grid, all from posts.
- `posts/index.astro` — `/posts`: category filter row + inline list search.
- `posts/[...slug].astro` — individual post via `PostLayout` (reading time, related posts, TOC rail, optional scroll-dark).
- `about.astro` — `/about`: the full CV (summary, experience, education, skills, recognition, languages), rendered from `config.about` and styled in `src/styles/pages/about.css`.
- `learning.astro` — `/learning`: a searchable card directory of study sites from `config.learning.items`, grouped by `tag`. Client-side filter over the cards (title/description/tag); styled in `src/styles/pages/learning.css`.
- `learning/[slug].astro` — `/learning/<slug>`: one topic embedded as a full-height iframe with a back link, "Reload", and "Open ↗"; `getStaticPaths` from `config.learning.items`, styled in `src/styles/pages/learning-item.css`.
- `projects.astro` — `/projects`: a searchable, tag-grouped card directory of projects from `config.projects.items`; same client-side filter as `/learning`, styled in `src/styles/pages/projects.css`.
- `projects/[slug].astro` — `/projects/<slug>`: one project's detail page — header with external-link / "Reload" actions, an optional embedded `demo` iframe, plus `details` prose and `stack` chips; `getStaticPaths` from `config.projects.items`, styled in `src/styles/pages/project-item.css`.
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
- **Learning** (`src/pages/learning.astro` + `learning/[slug].astro`, `styles/pages/learning.css` + `learning-item.css`) — new config-driven section: a searchable, tag-grouped card directory whose cards open per-topic detail pages that embed an external site as an iframe. Driven entirely by `config.learning`; both pages carry small page-scoped scripts (card filtering; iframe reload).
- **Projects** (`src/pages/projects.astro` + `projects/[slug].astro`, `styles/pages/projects.css` + `project-item.css`) — config-driven section built by mirroring Learning: a searchable, tag-grouped card directory whose cards open per-project detail pages (intro, `details` prose, `stack` chips, external link, optional `demo` iframe). Driven entirely by `config.projects`; both pages carry small page-scoped scripts (card filtering; iframe reload).
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