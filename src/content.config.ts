import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      focusEffect: z.literal('scroll-dark').optional(),
      category: z.string().optional(),
      homeFeatured: z.boolean().default(false),
      homeHeroOrder: z.number().int().positive().optional(),
      homeOrder: z.number().int().positive().optional(),
      draft: z.boolean().default(false),
    }),
});

// One file per learning item — metadata only, no rendered body. The filename
// (without extension) is the item's `id`, used as the `/learning/<slug>` path
// segment. Each item points at either an external `url` (embedded via iframe
// `src`) or an `embed` filename in `src/embeds/` (embedded via `srcdoc`). This
// mirrors the file-per-item pattern of `posts` so each ad-hoc addition stays an
// isolated, small diff instead of growing one giant array in the config.
const learning = defineCollection({
  loader: glob({ base: './src/content/learning', pattern: '**/*.{md,mdx,yaml,yml,json}' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      /** External site to embed as an iframe. Optional when `embed` is set. */
      url: z.url().optional(),
      /**
       * Filename of a self-contained HTML file in `src/embeds/`, rendered inside
       * the isolated frame via `srcdoc` instead of an external `url`. Takes
       * precedence over `url` for the embed; `url` (if also set) still powers the
       * "Open ↗" action.
       */
      embed: z.string().optional(),
      /** Optional topic tags — chips on the card and driving the tag filter. */
      tags: z.array(z.string()).optional(),
    })
    .refine((data) => Boolean(data.url || data.embed), {
      message: 'A learning item needs either a `url` or an `embed`.',
    }),
});

export const collections = { posts, learning };
