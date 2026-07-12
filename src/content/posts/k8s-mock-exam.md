---
title: 'Building My Own CKAD Mock Exam with a Real kind Cluster'
description: 'Prepping for CKAD/CKA with a self-hosted exam simulator: an LLM writes the scenarios, a real kind cluster grades them, and a browser terminal makes it feel like the real thing.'
pubDate: '2026-06-15'
category: 'Systems'
---

I'm going to attempt the **CKAD** (Certified Kubernetes Application Developer) and **CKA** (Certified Kubernetes Administrator) exams. Both are refreshingly hands-on: no multiple choice, just a live cluster and a list of tasks you have to actually *do* with `kubectl` against a two-hour clock. The trouble is practice — realistic, exam-shaped practice is either paid or scarce. So I built my own: [k8s-mock-exam](https://github.com/Gitrexx/k8s-mock-exam), a local exam simulator with a real cluster underneath.

## Why build it instead of buying one

The official exams are performance-based, and the good paid simulators know it — which is why realistic ones cost money and the free material tends to be quiz questions, not real tasks. I wanted three things the quizzes couldn't give me:

- **Unlimited, fresh scenarios** — not a fixed set I'd memorize.
- **A real cluster** — so the answer to every task is "did the cluster end up in the right state," exactly like the real exam.
- **The exam *feel*** — a timer, a terminal, flag-for-review, a score at the end.

The unlock for the first one was letting an **LLM generate the scenarios**, and the unlock for the second was **kind** (Kubernetes in Docker) running locally.

## Letting an LLM write the exam

The hard part of LLM-generated practice is trust — a made-up question is only useful if you can objectively check the answer. The scenario format is what makes that work. Each question is a small folder:

```text
scenarios/<question>/
├── scenario.yaml   # the prompt, its CKAD domain, and weighting
├── setup.sh        # seeds the starting state into an isolated namespace
└── verify.sh       # grades it: inspects cluster state, passes or fails
```

`verify.sh` is the ground truth. The LLM writes the prompt and the setup, but grading is a script that reads the actual cluster — so a hallucinated "correct answer" can't sneak through; only the real end state counts. That structure also makes the bank **extensible**: drop in a new folder and it shows up. Right now there are **22 scenarios spanning all five CKAD domains**, each seeded into its own namespace and auto-graded.

<div class="callout callout-warning">
  <p>LLM-generated questions still need a human pass. The model is great at producing plausible, well-formed tasks, but "plausible" isn't "on-curriculum" — I vet scenarios against the official exam objectives, and lean on <code>verify.sh</code> as the objective backstop. Treat it as practice, not a source of truth about what the real exam asks.</p>
</div>

## A real terminal, in the browser

The part I most enjoyed building is that you solve tasks in an actual shell, not a text box. The frontend embeds **xterm.js**; the backend spins up a real pseudo-terminal with **node-pty** and streams it over a WebSocket. So the browser terminal is a genuine `zsh` session wired to the kind cluster — you run real `kubectl`, `vim` a manifest, tab-complete, the works.

- **Frontend:** React + Vite + xterm.js, on `:5173`.
- **Backend:** Node.js + Express + WebSocket + node-pty, on `:3001`, talking to the cluster through an isolated kubeconfig.

It's the same muscle memory the real exam tests, which is the whole point.

## The exam experience

On top of that sits the exam wrapper, tuned to match the real thing:

- A **2-hour countdown timer**.
- **Per-question namespace isolation**, so one task can't contaminate another.
- **Flag-for-review** to come back to hard ones.
- An **end-of-exam report** — per-scenario pass/fail from each `verify.sh`, so I see exactly where I'm weak.

## Running it

One deliberate design choice: the app **attaches to an existing cluster** rather than creating and destroying one per run. Cluster lifecycle lives in scripts, so a slow `kind create` doesn't sit inside the exam loop:

```bash
npm install
./scripts/setup-cluster.sh    # create the local kind cluster ("ckad-mock")
npm run dev                   # web on :5173, server on :3001
# ...take the exam at http://localhost:5173 ...
./scripts/teardown-cluster.sh # remove the cluster when done
```

Everything runs locally on Docker — no cloud dependency, no bill, just a laptop and kind.

## What's next

Right now the repo covers **CKAD** — 22 scenarios across all five domains. **CKA is a work in progress**: the harness is the same, so it's mostly a matter of writing (and vetting) the administrator-side scenarios — etcd, cluster upgrades, RBAC, troubleshooting. I'll update both the repo and this post once the CKA set is ready.

Repo: [github.com/Gitrexx/k8s-mock-exam](https://github.com/Gitrexx/k8s-mock-exam).
