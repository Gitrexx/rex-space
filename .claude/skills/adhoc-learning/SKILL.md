---
name: adhoc-learning
description: >-
  Generate a comprehensive, interactive, single-file HTML learning module for a
  specific, narrowly-scoped technical topic. Use this whenever the user wants to
  learn, understand, get up to speed on, or go deep on a concrete concept,
  algorithm, technique, tool, protocol, or body of research — e.g. "explain the
  A* algorithm", "what are the current RAG techniques and research", "help me
  understand consistent hashing", "teach me how Raft consensus works", "I keep
  seeing 'speculative decoding' — what is it". Trigger even when the user does
  NOT say the words "skill", "HTML", or "interactive" — any request to genuinely
  learn or deeply understand a confined technical subject should use this skill
  rather than answering inline. Do NOT use for broad, open-ended subjects that
  can't be covered in one module (e.g. "learn Java", "learn Spanish", "become a
  data scientist") or for quick one-line factual lookups where a chat answer is
  clearly enough.
---

# Ad-hoc Learning

Turns a specific "I want to understand X" request into a polished, self-contained
interactive HTML learning module tailored to *why* the user is learning it and
the level they're coming in at.

The output is one `.html` file the user opens locally. It must work with a double-click,
no build step, no server.

## Who this is for (default learner profile)

Unless the intake says otherwise, assume the learner is a **strong ML / platform
engineer** (comfortable with Python, distributed systems, cloud, math notation).
Do **not** pad the module with beginner throat-clearing for topics inside that
wheelhouse. When the topic is *outside* it (e.g. a finance, biology, or pure-math
concept), the intake background will reveal that — then calibrate up the scaffolding.
Default output language is English; switch to Chinese or produce bilingual content
if the user asks or writes in Chinese.

---

## Step 1 — Intake

First, read the conversation for anything the user already gave you. Then ask
**only for the pieces that are still missing** — never re-ask what they already said.

Collect three things (the last two are optional but make the module far more relevant):

1. **What** do they want to learn? (the specific topic — required)
2. **Why / background** — what's driving this? A problem at work, prep for a design,
   curiosity, an interview? What do they already know adjacent to it?
3. **Where** did they see or read it? (a paper, a Hacker News thread, a codebase,
   a talk) — the source hints at the framing and depth they'll find useful.

Ask these conversationally and briefly. If the topic is clearly stated and the
user seems to want speed, you can proceed with just (1) plus one light question
covering (2)/(3) — don't turn intake into an interrogation.

**Scope check:** if the request is too broad for a single module (a whole language,
a whole career path), say so and offer to either (a) narrow it to one concrete
sub-topic now, or (b) pick the single most useful slice. Don't generate a shallow
module for a giant subject.

---

## Step 2 — Decide whether to research the web

Judge by the topic, not by whether the user asked:

- **Search** when the topic is fast-moving or recency-sensitive: current research,
  "state of the art / latest / current", specific tools/libraries/versions,
  benchmarks, anything that plausibly changed after your knowledge cutoff, or when
  the user's source (Step 1.3) is recent. Do enough searches to get real coverage
  (several, not one, for a research-survey topic), and cite real sources in the module.
- **Skip** (rely on your own knowledge) for timeless foundations: classic
  algorithms, established math, core CS theory, settled protocols. A* does not need
  a search; "current RAG techniques" does.
- **When unsure, do a quick search anyway** — the user has said there's generally no
  harm in it. A light verification pass catches drift on things you *think* are static.

Fold what you find into the module's content and its "Further reading" section.
Follow all copyright rules: paraphrase, short quotes only, cite sources.

---

## Step 3 — Build the HTML module

Start from `references/template.html` — it's a working scaffold with all four
interactive widgets already built and styled. Copy it to your working directory,
then replace the demo content with real, topic-specific content. Keep the design
system, the widget mechanics, and the JS plumbing; change the substance.

**Required interactive elements** (all four — the user asked for all of them):

1. **Skim vs. deep-dive toggle** — a global mode switch. Skim mode shows the
   essential spine; deep-dive reveals `.deep-dive` blocks (derivations, edge cases,
   proofs, extra nuance). Write genuinely layered content so both modes are coherent.
2. **Visual / animated explainer** — at least one. Use SVG/Canvas + JS to *show*
   the mechanism (e.g. A* expanding a frontier on a grid, an attention matrix
   lighting up, a hash ring rebalancing). Give it play / step / reset controls.
   This is the highest-value part — make it genuinely illustrate the idea, not decorate.
3. **Runnable code** — real, editable, executable snippets.
   - JavaScript runs natively in the sandboxed runner.
   - Python (common for ML topics) runs via Pyodide, which the template lazy-loads
     from CDN only when the user clicks Run, so page load stays fast.
   - Always show expected output as a comment/fallback so the snippet still teaches
     if execution is unavailable offline.
   - Pick the language that best fits the concept; keep snippets small and focused.
4. **Self-check quizzes** — a few multiple-choice questions with a "check" that
   reveals the answer *and an explanation of why*. Spread them through the module,
   not all at the end. Test understanding, not recall of trivia.

**Content structure** (adapt, don't rigidly follow):

- **Hook** — open by connecting to the user's stated *why*. One or two sentences.
- **Mental model** — the single core intuition, up front, before formalism.
- **The substance** — progressive depth, worked example(s), the visual explainer,
  runnable code where it clarifies.
- **Pitfalls & misconceptions** — where people (or the intuition) go wrong.
- **Cheat-sheet / summary** — the compressed takeaway they'd want to re-read later.
- **Further reading** — real sources (from Step 2 if searched), with one-line "why".

Tailor depth and examples to the learner profile and their stated reason. If they're
learning it to make a design decision, bias toward trade-offs and when-to-use-what.

**Quality bar:** self-contained single file; works offline except Pyodide/any CDN;
clean, distinctive typography (not a generic bootstrap look — see the template's
design system); accurate; and comprehensive enough that they wouldn't need to go
elsewhere for the fundamentals.

**Responsive / mobile:** the module must read well on a phone, not just a laptop —
these pages get embedded and opened on mobile, and the **page must never scroll
sideways**. The template already handles this; don't undo it. The mechanism:
`main{min-width:0}` plus the `max-width:820px` block drop `main` into the single
column and make wide **code blocks and tables scroll inside their own box** (the
page stays put). So: keep code in `<pre>` / `<div class="code-runner">` (they scroll
internally), don't give layout fixed pixel widths, and design canvas diagrams to
still read when scaled down (they're `width:100%` and shrink to fit — a dense diagram
that's illegible on a phone is a signal to simplify it). Check the reading column at
~375px wide before you ship.

---

## Step 4 — Save and present

Save to `./src/embeds`, and updates the learning section in `./astro-theme-config.ts` according,
Give a one or two sentence summary of what's inside — no long
post-amble. Offer to adjust depth, add sections, or spin off a follow-up module.

---

## Notes

- If content is long, keep the SKILL fast by putting only the *scaffold* in the
  template; write the real content directly into the copied file.
- Prefer accuracy over completeness — if you're unsure about a current detail and a
  search didn't settle it, say so in the module rather than guessing.