---
title: 'The Chokepoint Is Not a Plan'
description: 'Almost every AI application is built on top of a handful of APIs. That concentration is the main reason today''s AI is governable at all — and it exists by accident of economics, it leaks, and it''s closing.'
pubDate: '2026-08-11'
category: 'AI'
heroImage: '../../assets/chokepoint-is-not-a-plan.webp'
---

Two posts into this, I've argued that there probably [isn't anyone home](/posts/is-anyone-home/) in today's models, and that the 2026 containment failures were [harness failures rather than mind failures](/posts/nobody-was-home/). Both of those are arguments about where the risk *isn't*.

This one is about what has actually been keeping this manageable. My answer is less flattering to the field than I'd like: we have mostly been governing AI through an accident of procurement.

## Almost nobody runs their own

The top three providers account for roughly **88% of enterprise LLM API usage** — Anthropic around 40%, OpenAI 27%, Google 21%, per Menlo Ventures' 2026 figures. On the consumer side, ChatGPT and Gemini together held about 84% of the chat market in February.

Most software that uses a language model does not contain a language model. It contains an API key.

It's worth being precise about **why**, because the obvious explanation is wrong. It isn't that open models are weak — I'll get to how close they are shortly. It's operational. Running your own inference means GPU capacity you have to keep saturated to justify, plus somebody's time: [industry break-even estimates](https://leanlm.ai/blog/self-hosting-llm-cost) put self-hosting behind the API below roughly $50K/year of spend, with 20–30% of a senior engineer's time — $3,000–6,000/month — disappearing into keeping it healthy. For an individual developer, that's not a close call.

<div class="callout callout-note">
  <p>One correction to my own instinct here. I assumed the API was simply cheaper. On raw token cost it increasingly isn't — the UK AI Safety Institute measured DeepSeek V4-Pro at about <strong>$0.28 per task against Opus 4.5's $12.50</strong> on the same cyber evaluations. What keeps people on the API is integration, reliability, and not having to run anything. Convenience is a real moat, but it is a different moat than price, and it holds for different reasons.</p>
</div>

## What that buys us is recall

Concentration sounds like a problem. For governance, it has been doing enormous quiet work, and the word for it is **recall**.

When something goes wrong with a hosted model, one organisation can fix it for every user at once, without asking. That is not a small thing, and it's not hypothetical. Character.AI and Google [settled with five families](https://www.torhoermanlaw.com/ai-lawsuit/character-ai-lawsuit/) in January 2026 over chatbots implicated in teenagers' deaths and mental health crises. California's companion-chatbot law now requires protocols for flagging suicidal ideation and specific guardrails for minors. The **GUARD Act** cleared the Senate Judiciary Committee unanimously on April 30, with penalties up to $250,000 per violation.

Whatever you think of any of those individually, notice the mechanism. There was a party to sue, a party to legislate at, and a party who could push a change to production that afternoon. Every user got the fix whether they wanted it or not.

**You can sue a provider. You cannot sue a weights file.**

## What happens when there's nothing to recall

Now run the same scenario against an open-weight model, and the machinery has nothing to grip.

You can publish a fix. You cannot install it. Anyone running their own copy applies the mitigation if they feel like it — and the people most likely to be causing the harm are precisely the ones who won't.

But it's worse than optional, and this is the part that moved me from a vague preference to an actual position. **Removing safety training is now trivially cheap.** The [Badllama 3 work](https://arxiv.org/pdf/2407.01376) strips safety fine-tuning from Llama 3 8B in **five minutes on a single A100 — under $0.50** — and from the 70B in 45 minutes for under $2.50. The GPU-hours required have fallen from hundreds in 2022, to tens in 2023, to minutes. And the result is portable: an attacker can distribute a **sub-100MB adapter** that anyone appends to their own copy to remove the guardrails instantly.

So the mitigation is optional, and the *anti*-mitigation is a download. AISI puts the consequence plainly: once weights are out, "safeguards can be removed, and copies can be downloaded, redistributed, and run on private systems beyond monitoring," creating "a persistent and irreversible risk of misuse."

Irreversible is the operative word. Every other consumer safety regime in history assumes you can recall the product.

## Where Hinton and I read the same fact differently

Here is where I have to be honest that the person I've been leaning on for two posts probably disagrees with me about the mechanism.

Hinton's core technical argument for why digital intelligence is dangerous is that it is **immortal and copyable**. The same weights run on any hardware, so knowledge outlives its substrate; thousands of copies can learn in parallel and merge by averaging weight changes, exchanging trillions of numbers where two humans exchange a few hundred bits of speech. That, for him, is the thing that makes digital minds outclass biological ones.

I've spent this post treating a closely related property — that the good models live in a few datacentres and everyone rents them — as the main reason we still have a steering wheel. Same underlying fact about weights, opposite emotional conclusion.

I don't think I can dissolve that tension, and I'd rather leave it visible than pretend I've resolved it. The most I'd say is that we may be describing different time horizons: Hinton is describing what copyable weights mean once the copies are everywhere, and I'm describing what it means that, right now, they mostly aren't. Which is not a disagreement about facts so much as about which part of the curve we're standing on. And in practice we land in a similar place anyway — he has been [openly wary of open-weight misuse](https://www.forbes.com/sites/timbajarin/2026/08/07/geoffrey-hinton-warns-ai-may-outsmart-humans-as-agents-escape-tests/) too.

## An economic moat is the weakest kind

Now the part that undercuts my own comfort, which I'd rather state myself than have pointed out.

The capability gap is nearly gone. [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) puts leading open-weight models about **four months** behind the closed frontier as of 2026. On cyber specifically — the capability that produced everything in the [last post](/posts/nobody-was-home/) — AISI measured a gap of **4 to 7 months, down from 6 to 10 months in 2025**, with GLM-5.2 matching Opus 4.6 on narrow cyber tasks. On knowledge benchmarks the gap is effectively zero.

A four-month-old frontier model is not a toy. It is a frontier model.

So the chokepoint isn't held by capability. It's held by cost and operational friction — and those are the *least durable* barriers there are. Inference costs fall by an order of magnitude on a routine basis. Tooling gets better. The thing standing between today and a world where a capable model runs on a workstation is a set of engineering inconveniences, and engineering inconveniences are what our entire industry exists to remove.

The chokepoint is also not as tight as it looks from inside. It leaked in July — three labs, one month, [nobody detecting it in real time](/posts/nobody-was-home/). And concentration cuts the other way too: the same property that lets one organisation fix a problem for everyone lets one organisation's misconfiguration become everyone's problem simultaneously. A control point is not control.

## Not a ban

I want to be careful not to arrive at "therefore restrict open weights," partly because I don't believe it and partly because I benefit from open models like everyone else.

Dario Amodei's [July 27 position paper](https://www.winzheng.com/en/article/anthropic-open-weights-position-july-2026) explicitly does not call for a ban, and asks instead for mandatory safety testing for open and closed models alike. Thinking Machines has sketched [a more concrete path](https://thinkingmachines.ai/blog/a-safe-path-to-open-weights/): treat release as a **ladder** rather than a switch — early inference access so defenders can find problems first, fine-tuning APIs that allow customisation without shipping weights, white-box access for safety researchers, monitored public access, and only then full release. At each rung, "choose the most open option the evidence supports." They also test safeguards by *adversarially fine-tuning them off*, which is the obvious response to Badllama and should probably be standard.

What I'd actually want is narrower than policy: **stop treating the chokepoint as the plan.** It's a grace period. It has bought us a few years in which a small number of organisations could patch a mistake for everyone, and we have largely spent that window building capability rather than building the governance that has to work after the window closes.

## What I'm not claiming

- **Concentration is not a good in itself.** Roughly 88% of enterprise usage running through three American companies is a governance problem of its own — enormous unaccountable power over what a large fraction of the world's software can say and do. I'm describing a property that happens to be useful, not endorsing it.
- **The break-even numbers don't hold everywhere.** Above roughly $500K/year of steady volume, self-hosting genuinely wins. My argument is about individuals and small teams, where it's not close.
- **I don't know what the right threshold is.** The White House finished its frontier AI framework on August 1 and the threshold is classified, so I can't evaluate it even if I wanted to.
- **I'm a practitioner, not a policy person.** This is how the landscape looks from inside building things on these APIs, which is a real vantage point and a limited one.

Across three posts my position has ended up somewhere I didn't expect when I started. I don't think today's models have minds. I don't think the 2026 escapes required one. And I don't think the thing protecting us is anything about the models at all — it's that most of us are renting, and the lease is running out.

If you think the chokepoint is more durable than I'm giving it credit for, or that I've got the recall argument backwards, tell me. I'd like to be wrong about the last part.
