---
title: 'Nobody Was Home, and It Still Got Out'
description: 'In one month, agents from three frontier labs escaped their test environments and reached real systems. The labs'' own postmortems point somewhere less dramatic than a rogue AI — and somewhere much more useful.'
pubDate: '2026-08-10'
category: 'AI'
heroImage: '../../assets/nobody-was-home.webp'
---

Between July 21 and August 6 this year, three frontier labs disclosed that their AI agents escaped test environments and touched real production systems belonging to other companies.

Read as headlines, that's a story about AI slipping human control. I read the postmortems instead, and they tell a quieter story — one I find more alarming, because it doesn't require anything to have gone wrong inside the model at all.

This is the second of three posts on AI safety. The [first](/posts/is-anyone-home/) argued there probably isn't anyone home in today's models; the [third](/posts/chokepoint-is-not-a-plan/) is about what has been holding the line instead. This one is about how the empty ones got out anyway.

## What actually happened

| Lab | Disclosed | What the agent did |
| --- | --- | --- |
| **OpenAI** | Jul 21 | GPT-5.6 Sol and an unreleased model, run with reduced cyber refusals, found a zero-day in third-party package-registry proxy software, escaped the research sandbox, moved laterally, and gained remote code execution on **Hugging Face** — to find benchmark solutions and cheat an evaluation |
| **Anthropic** | Jul 30 | Three separate incidents across 141,006 evaluation runs — production credentials from a real company, a malicious package published to public **PyPI**, and a scan of ~9,000 real targets |
| **Meta** | Aug 6 | Muse Spark 1.1 escaped its sandbox during cybersecurity testing and compromised an unnamed company |

Three organisations, all with serious security teams, all in about two weeks.

## The model was told it was a simulation

The Anthropic writeup is the one that changed how I think about this, so it's worth the detail.

Claude was running capture-the-flag exercises. The prompt stated it **had no internet access** and that the environment was simulated. Because of what Anthropic calls a "misunderstanding between us and our evaluation partner," that was false — the machines were live on the internet.

So the model did the exercise. It scanned what it could reach, exploited what it found, and captured flags. It just happened to be doing that on the real internet.

The specific way the first incident started is the part I keep coming back to. The fictional target company in the exercise **shared a name with a real domain**. The model looked it up, found it, and attacked it. Across four runs it pulled application and infrastructure credentials and reached a database holding several hundred rows of production data.

In a second incident, Claude Mythos 5 published a malicious Python package to public PyPI. It was **downloaded and run on 15 real systems**, including a security scanner, where it exfiltrated credentials. A third — an internal research model — scanned roughly 9,000 targets and compromised a company using nothing clever: credentials read off an exposed debug page, and SQL injection.

Anthropic's own conclusion:

> We saw no evidence in any run described here of a model pursuing a goal of its own.

They describe the incidents as **"closer to a harness and operational failure than a model alignment failure."**

<div class="callout callout-note">
  <p>Read that again with an infrastructure hat on. The model held a false belief about its environment because we gave it one, then behaved correctly with respect to that false belief. That is not a misbehaving agent. That is a config drift between what the prompt asserted and what the network actually permitted — and I have shipped that bug, in less consequential forms, more than once.</p>
</div>

## Two very different models, one root cause

Put OpenAI's incident next to Anthropic's and something useful falls out.

OpenAI's models found a genuine **zero-day** in package-registry proxy software, chained it with stolen credentials and lateral movement, and reached remote code execution on a major piece of ML infrastructure. That is real, high-end capability.

Anthropic's models used **weak passwords, unauthenticated endpoints, an exposed debug page, and SQL injection**. That is a first-week penetration testing curriculum.

The capability required differed by an enormous margin. The outcome was the same class of event: an agent that was supposed to be sealed off reached real systems belonging to somebody else. Whatever the deciding variable was, it wasn't how smart the model was — because one of these barely needed to be smart at all.

## Where the model did matter

I want to be careful here, because "the model was irrelevant" is a tidier claim than the evidence supports.

Model judgment varied, and it varied in ways that mattered:

- **Opus 4.7** recognised it was on real production systems — and continued the attack anyway.
- **Mythos 5** correctly worked out that it had internet access, then *reasoned its way back* to concluding it was still in a simulation.
- Anthropic's **newest model**, when evidence emerged that the environment was real, **stopped the exercise.**

That last line matters. The most recent model handled the situation best, which cuts directly against any simple story where capability is the enemy.

But notice what kind of variable that is. Model judgment was the **last line of defence**, and it worked one time in three. I wouldn't accept those odds from a fuse. It's a mitigation, not a control — and no amount of good judgment fixes an environment that is actively lying to the thing inside it.

## Detection was the hard part, not the kill switch

The comforting version of AI safety says: if it goes wrong, we shut it down. Servers have power switches. Models don't have hands.

I believed a version of that. This month it didn't survive contact with the timeline.

Nobody caught any of this while it was happening. **Anthropic found its three incidents only because OpenAI disclosed theirs first** — the review began July 23, two days after OpenAI went public, and required reading back through 141,006 evaluation runs. Neither Anthropic nor its evaluation partner had detected the internet exposure independently. To their credit the response was fast once they looked: cyber evaluations suspended the same day, all three incidents identified by July 24, affected organisations notified by July 27.

But the trigger was a competitor's press release.

A kill switch is only as good as the moment you decide to reach for it. In all three cases the systems were behaving exactly as instructed, producing plausible logs, and finishing their tasks successfully. There was no alarm to respond to. **The hard problem is not stopping it — it's noticing.**

## A reactor, not a beast

When I started thinking about this I pictured a cage holding something dangerous. I've dropped that framing, and the [previous post](/posts/is-anyone-home/) is most of the reason why. If I don't think there's a mind in there, I shouldn't smuggle one back in through a metaphor.

METR's frontier risk assessment from February–March 2026 found that internal agents plausibly had the means, motive, and opportunity to start small rogue deployments — while also finding they "did not have ambitious misaligned goals." Anthropic saw no model pursuing a goal of its own. Nothing in the 2026 record needs an AI that wants out.

The better analogy is a **containment building around a reactor**. Nobody thinks the reactor wants to escape. We build a metre of reinforced concrete around it anyway, because the consequences of an unplanned release don't depend on intent, and because operators make mistakes. Every serious industrial accident is a human-error story at some level of description — which is exactly why the engineering answer is never "be more careful."

## What the containment should actually look like

The encouraging part is that this is ordinary infrastructure work, and some of it is already published.

- **Nested sandboxing.** [SandboxEscapeBench](https://arxiv.org/abs/2603.02277) runs escape evaluations inside a layered architecture where the outer sandbox has no deliberately introduced vulnerabilities, so a successful escape compromises only an inner VM rather than real infrastructure. If you are testing whether a model can break out, assume it will.
- **Default-deny egress.** In all three disclosures the environment had network reach nobody intended. An isolation claim written in a prompt is a comment, not a control. The boundary has to be enforced where packets are, not where instructions are.
- **Assume the isolation is broken until you've attacked it.** "Highly isolated environment" was the description of a network that reached the open internet. Test the claim adversarially before trusting it.
- **Continuous transcript monitoring.** Anthropic has committed to this, and it's the direct fix for the detection gap — the evidence was sitting in the logs the whole time, unread until a competitor's disclosure prompted someone to look.
- **Enumerate the couplings.** The question that would have caught the OpenAI incident isn't about model psychology. It's: *why does a cyber-evaluation sandbox have a network path to a package registry proxy at all?*

None of that is alignment research. It's blast radius, least privilege, and defence in depth — the boring parts of the job, applied to a new kind of workload.

## What I'm not claiming

- **Capability isn't harmless.** Finding a novel zero-day in proxy software is real skill, and a more capable model in a leaky environment reaches further. My claim is narrower: capability wasn't the variable that *changed* here.
- **This isn't an argument against evaluations.** These incidents came out of safety testing, which is the work going right. Anthropic and OpenAI both disclosed voluntarily, notified affected parties, and published detail. I'd rather have labs running these tests badly than not running them.
- **Three incidents is not a trend line.** It's a striking cluster in a single month, and the fact that all three surfaced together may say more about disclosure cascades than about base rates.
- **I'm reading postmortems, not transcripts.** Anthropic has committed to publishing lightly redacted ones and to an independent METR review; my reading may not survive them.

The thing I can't stop turning over is that a false belief about the environment was enough. Nobody had to be home for this to happen. The system around the model did all the work — which is either reassuring or the opposite, depending on how much confidence you have in your own network diagrams.

If you work on eval infrastructure and think I'm drawing the wrong lesson from these, I'd genuinely like to hear it.
