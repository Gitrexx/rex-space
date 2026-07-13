---
title: 'A Scale-to-Zero Kubernetes Playground on GKE Autopilot'
description: 'Notes on a personal GKE Autopilot cluster I spin up to practice Kubernetes, then tear down — no standing bill, GitOps-lite deploys with Kustomize and GitHub Actions.'
pubDate: '2023-09-02'
category: 'Systems'
heroImage: '../../assets/kubernetes-on-gcp-autopilot.webp'
---

I wanted a real Kubernetes cluster to practice on — not minikube on my laptop, but the actual thing on a public cloud, with cloud networking, load balancers, and the friction that comes with them. The catch is the usual one: a cluster you leave running quietly bills you while you sleep. So the goal became a cluster I can **conjure on demand and delete when I'm done**, paying nothing in between.

This is a short set of notes on how I set that up on Google Cloud. The full repo is [Gitrexx/k8s-on-gcp](https://github.com/Gitrexx/k8s-on-gcp).

## Why Autopilot

GKE offers two modes: **Standard**, where you provision and manage the node pool yourself, and **Autopilot**, where Google runs the nodes and you just declare Pods. For a throwaway practice cluster, Autopilot wins on economics:

- **You pay for what your Pods request, not for provisioned nodes.** In Standard mode you're paying for the VMs in your node pool whether or not anything is scheduled on them — that idle **node bill**, not the management fee, is what makes a Standard cluster expensive to leave running. In Autopilot you're billed for the CPU, memory, and storage your *running* Pods request.
- **It's shared capacity, not reserved.** Autopilot pulls from a shared pool rather than reserving machines for you. That's the trade that makes scale-to-zero real: with no workloads scheduled, there are no nodes sitting idle on your bill.
- **Idle cost trends to nothing.** There's still a flat **cluster management fee** (~$0.10/hr for the control plane) that applies to *both* modes regardless of nodes or traffic — but GKE's free tier covers it for one cluster per billing account. With that credit, no nodes, and no running Pods, an idle Autopilot cluster costs effectively nothing.

So the shape of the thing is: the cluster can exist, empty, and cost me nothing. The moment I deploy a Pod I start paying for exactly that Pod's requests, and the moment I delete it I stop.

<div class="callout callout-warning">
  <p>"Nothing" carries two conditions: the free-tier credit is covering your one cluster's management fee, and you have no <strong>orphaned resources</strong> — persistent disks (PVCs), load balancers, and reserved static IPs all bill separately and can outlive your Pods. Deleting the cluster (and confirming those are gone) is what truly zeroes the bill. Cloud pricing also changes and has fine print, so treat this as the shape of the model, not a quote — check current GCP pricing before relying on any number.</p>
</div>

## The workflow I actually wanted

The use case is bursty and personal:

- An **interview** coming up where I want to talk through — or live-demo — deploying and scaling a workload on Kubernetes.
- An **ad-hoc experiment** where I need a real cluster for an afternoon, not a permanent one.
- General **practice** at managing workloads on cloud Kubernetes: namespaces, rollouts, services, ingress, the whole muscle memory.

For all of these the pattern is the same — spin up, do the thing, tear down — and Autopilot lets me do it without a standing cost as the price of admission.

## How the repo is set up

Rather than `kubectl apply` things by hand every time, I set the repo up as a small **GitOps-lite** environment: manifests live in git, [Kustomize](https://kustomize.io) manages them, and GitHub Actions deploys on push.

```text
k8s-on-gcp/
├── .github/workflows/
│   ├── deploy-mlflow.yml    # path-triggered: fires on apps/mlflow/** changes
│   └── validate.yml         # PR dry-run validation, auto-detects changed apps
├── apps/
│   └── mlflow/
│       ├── base/            # canonical manifests: namespace, deployment, service
│       └── overlays/dev/    # GKE-specific patches + image tags
├── cluster/
│   └── kustomization.yaml   # aggregates apps for local reference
├── scripts/
│   ├── bootstrap.sh         # one-time gcloud + kubectl context setup
│   └── validate.sh          # local dry-run manifest check
└── README.md
```

A few decisions worth noting:

- **One namespace per app.** Each workload is isolated, so tearing one down never touches another.
- **Base + overlay.** The `base/` holds the canonical manifests; `overlays/dev/` patches in the GKE-specific bits (image tags, resource tweaks). Adding an environment later is just another overlay.
- **Path-triggered deploys.** Changing MLflow's manifests fires only `deploy-mlflow.yml`, so nothing else is touched. Each new app gets its own workflow with its own path filter.
- **First workload: MLflow.** A tracking server is a genuinely useful thing to have on a cluster, and a good non-trivial deployment to practice on.

The GitHub Actions side authenticates to GCP with a handful of repo secrets — `GCP_PROJECT_ID`, `GCP_SA_KEY`, `GKE_CLUSTER_NAME`, `GKE_CLUSTER_ZONE` — so a push to `main` becomes a deploy.

## Spin up, tear down

The lifecycle is the whole point. Creating an Autopilot cluster is one command (this is the heart of what `scripts/bootstrap.sh` wraps):

```bash
gcloud container clusters create-auto my-cluster \
  --region asia-southeast1 \
  --project my-project-id
```

Deploy a workload — either by pushing manifests and letting the Actions workflow apply them, or locally:

```bash
kubectl apply -k apps/mlflow/overlays/dev
```

And when I'm done, the cluster goes away entirely, which is what stops the meter:

```bash
gcloud container clusters delete my-cluster --region asia-southeast1
```

That last command is the one that matters for the "costs nothing when idle" promise. Deleting workloads stops the compute charges; deleting the cluster tears down the control plane and nodes. Just double-check that any persistent disks, load balancers, or reserved IPs are gone too — those can outlive the cluster and keep billing.

## Notes to self

- **Scale-to-zero is a mindset, not just a feature.** Designing for "this should cost nothing when idle" changes how you set things up — ephemeral cluster, manifests in git, one command to rebuild.
- **GitOps-lite pays off even solo.** Keeping manifests in the repo means recreating the whole environment is a `git`-and-`apply` away, not archaeology.
- **Practice the teardown too.** Being fast and confident at deleting is what makes spinning up cheap. The delete command is as much a part of the workflow as the create.

Repo: [github.com/Gitrexx/k8s-on-gcp](https://github.com/Gitrexx/k8s-on-gcp).
