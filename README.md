# Rex Space

My personal corner of the web — a home for my CV, blog posts, projects, and learning notes.

It's a static site built with [Astro](https://astro.build) on top of the [Tone](https://github.com/hanityx/astro-tone) theme: typography-first, quiet by default, with dark mode, RSS, and built-in search.

## What lives here

Four kinds of content, all served from one small, fast static site:

- **CV** — a short bio, career timeline, focus, and links, on the **About** page.
- **Blog** — tech write-ups, thoughts, and the occasional sci-fi story.
- **Projects** — each with an intro, the details, a link out to the work, and interactive demos where they help.
- **Learning materials** — a searchable directory on the **Learning** page: standalone study sites I keep elsewhere, each embedded on its own page.

Today the blog (and, for now, projects) is authored as **posts** (Markdown / MDX) and grouped by **category**. Two sections are config-driven instead of posts: the CV on the About page, and the Learning directory (both edited in `astro-theme-config.ts`). The home page opens with a short greeting and a **quote that rotates daily**, drawn from a curated list in `src/data/quotes.ts`. See [`.claude/CLAUDE.md`](.claude/CLAUDE.md) for how the pieces fit together and where to extend.


## Credits

Built on the **Tone** theme by [hanityx](https://github.com/hanityx/astro-tone). MIT licensed.
