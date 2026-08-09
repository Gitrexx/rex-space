---
name: draft-post
description: Rex's guided workflow for writing a new blog post for Rex Space — talk the idea through, challenge the weak claims with real research, settle on what the post will actually assert, then outline it, write it into src/content/posts/, and generate the hero image. Manual invocation only. Run this ONLY when Rex explicitly asks for it (`/draft-post`, "let's use the post skill", "start a post with the drafting workflow"). Do NOT trigger it because a post, the blog, or writing merely came up — ordinary requests to fix a typo, add a section, or write something quick should be handled normally without this skill.
---

# Draft a post

This is a **conversation first and a writing task second**. Rex comes in with a half-formed
idea. The job is to make the idea survive contact with reality — find the soft claims,
check them against sources, and agree on what the post will actually assert — and only then
write it. A post that goes out with a confidently wrong sentence in it costs more than a
post that took an extra twenty minutes to argue about.

Scope: **technical write-ups and opinion pieces.** If Rex wants to draft a sci-fi story,
say this workflow isn't built for fiction and offer to just write it with him instead.

## The single biggest failure mode

Drafting too early. Rex says a few sentences about a project, they sound reasonable, and the
instinct is to reward that with prose. Resist it. Until Phase 4, **produce no post prose at
all** — no sample paragraphs, no "here's how the intro might read." Early prose anchors the
conversation on wording and quietly ends the thinking. Stay in questions and evidence.

The second failure mode is agreeable research: searching for something that confirms what
Rex said, finding it, and moving on. Search for what would make him *wrong*.

---

## Phase 1 — Draw the idea out

Let Rex talk. Ask what the post is about and then get the shape of it with questions like:

- What's the one thing a reader should walk away believing?
- Who is this for — someone who hit the same problem, or someone who's never heard of it?
- What did you actually build/run/measure, versus what are you inferring?
- What's the part you're least sure about?

That last question is the highest-yield one. Ask it every time.

Don't interrogate all at once — two or three questions per turn, follow where he goes. When
you can state the post's thesis in one sentence and he agrees with your statement of it,
Phase 1 is done.

## Phase 2 — Find the flaws

Now go looking for what's wrong. Read back over everything Rex has said and hunt for these
specifically:

| Flaw | What it sounds like |
| --- | --- |
| **n=1 generalization** | "This is the right way to do X" from one project that worked |
| **Stale fact** | Version numbers, pricing, free tiers, defaults, deprecations — these rot fast |
| **Number from memory** | "It's about 10× faster", "costs basically nothing" |
| **Claim about a tool he hasn't used** | Comparisons to the alternative he read about but never ran |
| **Correlation as cause** | "I changed X and it got faster" with no isolation |
| **Missing failure case** | Where does this approach fall apart? A post that has no limits section is usually hiding one |
| **Already exists** | Did he rebuild something that ships in the platform? Worth knowing before publishing, even if the answer is "yes, and I'd still build it" |

Then **verify, and split the verification by claim type** — this matters, because most of
Rex's posts are about things he built:

- **Claims about his own code** ("the toggle scales to zero", "there are 22 scenarios") —
  check the **repo**, not the web. Read the files. Run the command. The source is right
  there and memory of it drifts.
- **Claims about the outside world** (how a service bills, what a flag defaults to, what
  version shipped what) — use **WebSearch / WebFetch**. Prefer primary sources: official
  docs, changelogs, release notes, the actual repo, RFCs, published benchmarks. A blog post
  agreeing with Rex is not verification. Note the date on what you find; today's date is in
  your context, so say when a source is old enough to be suspect.

Bring findings back as **specific corrections with the source attached**, not vague worry.
"I'd double-check that" is useless. "GKE Autopilot bills per-Pod resource requests, and
since [date] there's also a cluster management fee — the 'scaled to zero costs nothing'
line needs a caveat: <link>" is the standard.

Be direct and don't pad the disagreement with compliments. Rex asked for this on purpose.
And when he's right, say so plainly and move on — manufactured objections waste the round
and make the real ones cheaper.

## Phase 3 — The claim ledger

Keep a running table of every load-bearing claim in the post. Restate it after each research
round so the state of the argument is always visible:

| # | Claim | Status | Basis |
| --- | --- | --- | --- |
| 1 | Autopilot Pods scaled to zero cost nothing | ✏️ revised | Pod requests are free at zero, but cluster fee applies — <link> |
| 2 | kind is the cheapest way to get a real cluster locally | ✅ grounded | kind docs + local run |
| 3 | LLM-generated scenarios beat paid simulators | ⚠️ unsupported | No comparison run; opinion |

Statuses: **✅ grounded** (verified, source noted) · **✏️ revised** (Rex's version was off;
here's the corrected form he accepted) · **❌ dropped** · **⚠️ unsupported** (no evidence
either way, keeping it anyway).

Rex decides when the ledger is good enough — there's no gate here. Keep surfacing what you
find each round, and when he says draft it, draft it. Carry the ⚠️ rows forward: they don't
get cut, they get **hedged in the prose** ("in my experience", "I haven't benchmarked this
against X", "my guess is"). That's the deal — he keeps the claim, the reader gets an honest
signal about how firm it is. Never let an ⚠️ claim reach the page in the flat declarative
voice used for a ✅ one.

## Phase 4 — Outline, in chat

Before writing anything, put the structure in front of him:

- Working title and the one-line `description` (this is card + search + social copy, so it
  has to stand alone)
- Proposed `category` — from `content.categoryOrder` in `astro-theme-config.ts`; say so if
  nothing fits and a new one is warranted
- Slug (kebab-case; it's the filename and the URL)
- Each `##` section as a heading plus one line on what it argues
- Where code blocks, a callout, or an inline SVG diagram would earn their place

Keep it scannable. He'll reshuffle, cut, or add sections — do that, re-show it if the change
was big, then write.

## Phase 5 — Write the file

**Read one or two existing posts first** (`service-switch.md`, `k8s-mock-exam.md`). The
corpus is the style guide; a description of the voice is a worse guide than the voice
itself. What you'll find there: first person, concrete, short declarative sentences, key
terms **bolded** on first use, real commands rather than descriptions of commands, honest
about limits, links out to the repo and to related posts.

### Stance and tone

Rex writes to open a conversation, not to win one. A post is a considered personal view put
out for discussion — so the register is humble, neutral, and genuinely open to being wrong.
That shapes specific choices:

- **Disagree with arguments, never with people's judgment.** When Rex lands somewhere
  different from a well-known figure, the frame is "their claim sent me thinking, and here's
  where I currently land" — not "they're wrong." Say what he respects about their position
  first, and assume they have reasons he may not have fully understood. Attack the strongest
  version of the other view, not a convenient one.
- **Mark opinions as opinions.** "For now, with my own understanding" · "where I get stuck" ·
  "the version I'd rather defend." A reader should never have to guess which sentences are
  sourced and which are Rex's read.
- **Turn the sharpest objection on his own argument, in his own voice.** A callout conceding
  the weak premise buys more credibility than another paragraph of support, and it's the
  thing that makes the rest of the post trustworthy.
- **Respect other positions on the way past them** — especially definitional disagreements,
  where reasonable people genuinely split. Acknowledging that costs nothing and it's true.
- **End open.** Invite objections rather than delivering a verdict. A "Takeaways" list that
  restates the argument reads as closing the case; a couple of lines asking to be corrected
  reads like Rex.

The failure mode on the other side is real, though: **humility is not mush.** Prose so
hedged it refuses to claim anything is worse than a clear position held loosely. State the
view plainly, then mark its limits — don't pre-dilute every sentence on the way out.

### Length

Aim for an **6–9 minute read** unless Rex says otherwise. The theme computes that with the
`reading-time` library over the *raw* body (`src/pages/posts/[...slug].astro`), so inline
SVG markup and footnotes count toward it — an essay with a diagram needs more prose trimmed
than the word count suggests. Check before handing back:

```bash
node -e "const rt=require('reading-time'),fs=require('fs');
let s=fs.readFileSync('src/content/posts/<slug>.md','utf8').replace(/^---[\s\S]*?\n---\n/,'');
console.log(Math.round(rt(s).minutes),'min')"
```

If it runs long, cut a summarizing section before cutting an argument — recap sections are
usually the least load-bearing prose in the post.

Write the complete post to `src/content/posts/<slug>.md`. Frontmatter fields, categories,
prose rules (`##` only — the title is the sole `h1`), callouts, tables, and footnotes are all
specified in the project's `CLAUDE.md` and `.claude/rules/markdown-reference.md`, which are
already loaded — follow them rather than reinventing the format. `pubDate` is today.

Two things worth repeating because they're easy to get wrong:

- No editorial scaffolding in the file. No "TODO", no bracketed notes to Rex, no meta
  commentary about the drafting process. The file should read as finished.
- Every ✏️ revision from the ledger has to be reflected in the prose. It's easy to correct
  a claim in conversation and then write the original version from memory an hour later.

## Phase 6 — Hero image

Generate the cover automatically once the post is written — use the `generate-image` skill
with **`--provider gpt`**, save to `src/assets/<slug>.webp`, and wire it in as
`heroImage: '../../assets/<slug>.webp'`. The house look is dark background, soft bloom,
minimal, abstract, **no text or labels**; vary the palette and motif to suit the post. The
existing covers in `src/assets/` are the reference. Offer a re-roll — he may want a different
motif.

## Closing the loop

When you hand back, tell him three things:

1. Where the file is, and to check it with `astro dev --background` (or `npm run check` for
   a fast frontmatter/type validation).
2. **Which ⚠️ claims shipped hedged**, listed explicitly. This is the last chance to catch
   one he'd rather cut.
3. Anything you researched that didn't make the post but is worth knowing.

Don't commit unless he asks.
