---
title: 'Service Switch: A One-Click Power Button for My GKE Cluster'
description: 'A small local Flask dashboard that drives my own gcloud and kubectl to toggle GKE services on and off — scale-to-zero turned into a button, the companion to my k8s-on-gcp cluster.'
pubDate: '2023-11-13'
category: 'Systems'
heroImage: '../../assets/service-switch.webp'
---

This is the companion to my [k8s-on-gcp](/posts/kubernetes-on-gcp-autopilot/) cluster. That project gave me a cheap, on-demand GKE Autopilot cluster and a GitOps-lite way to deploy things to it. This one gives me the missing piece: a **power button**.

On Autopilot, a Pod scaled to zero costs nothing — you're billed for what your *running* Pods request. So "is this service on?" and "am I paying for this service?" are the same question. [Service Switch](https://github.com/Gitrexx/service-switch) makes that question a toggle in a browser instead of a console visit or a memorized `kubectl` command.

## The problem it solves

Once the cluster existed, my day-to-day looked like this: deploy some cloud-native open-source project — an MLflow tracking server, say — turn it on, poke at it, and turn it off when I'm done so it stops costing me. The turning on and off was the friction:

- Opening the **GCP console**, finding the workload, editing the replica count.
- Or dropping to a terminal for `kubectl scale deployment mlflow --replicas=1 -n mlflow`, then again with `--replicas=0` later.

Neither is hard, but both are enough friction that I'd leave things running "just for now" and quietly pay for it. I wanted a single screen showing every service and a switch next to each. A **UI-based command center** for my own cluster.

## How it works

Service Switch is a small **Flask** app you run locally, reachable at `http://localhost:8080`. The trick to how it stays simple: it doesn't reimplement Google's APIs or hold any credentials of its own. Under the hood it **drives the same `gcloud` and `kubectl` CLIs you already have authenticated** on your machine.

- It reads your cluster details from a `config.yaml`.
- It lists the **Deployments** in your namespace as a row of services.
- Each toggle scales that Deployment: **on** restores the configured replica count, **off** scales it to **zero**.
- It can also start and stop **port-forwards**, so you can reach a service on `localhost` for testing without exposing it publicly.

Because the "off" state is genuinely zero replicas, on Autopilot that means the service stops consuming billable resources — the switch is as much a cost control as a convenience.

## The "on" switch is just a scale command

There's no magic under the toggle. Enabling a service is the moral equivalent of:

```bash
kubectl scale deployment mlflow --replicas=1 -n mlflow
```

and disabling it is:

```bash
kubectl scale deployment mlflow --replicas=0 -n mlflow
```

Service Switch just wraps those in an API and puts a button on top. The endpoints are small and honest:

```text
GET  /api/services                      # list deployments + current state
POST /api/services/{name}/enable        # scale up to configured replicas
POST /api/services/{name}/disable       # scale to zero
POST /api/services/{name}/port-forward/start
POST /api/services/{name}/port-forward/stop
GET  /api/port-forwards                 # list active tunnels
```

## Running it

Point a `config.yaml` at your cluster and namespace, then run it:

```yaml
# config.yaml (illustrative)
project_id: my-project-id
region: asia-southeast1
cluster_name: my-cluster
namespace: mlflow
default_replicas: 1
```

```bash
pip install -r requirements.txt
python main.py
# open http://localhost:8080
```

There's also a Docker path that mounts your existing gcloud credentials read-only, so the container reuses your auth instead of needing its own:

```bash
docker run -p 8080:8080 \
  -v ~/.config/gcloud:/root/.config/gcloud:ro \
  -v $(pwd)/config.yaml:/app/config.yaml:ro \
  service-switch
```

## Why local, with my own CLIs

The design choice I like most is that it's **local-first and credential-light**. It assumes you've already run `gcloud auth login` and have a working `kubectl` context, and it simply borrows them.

- **No service-account keys** baked into the app or committed anywhere.
- **Least surprise** — it can do exactly what *you* can do from your terminal, no more.
- **Read-only credential mount** in the Docker path, so the container never gets write access to your gcloud config.

It's a control panel for *my* access, not a shared service with its own privileges. For a personal tool that's exactly the right amount of security.

## The pair

Together the two projects form a tidy loop:

- **k8s-on-gcp** — a scale-to-zero Autopilot cluster with GitOps-lite deploys. *Where things run.*
- **Service Switch** — a local dashboard to flip those things on and off. *When they run — and when they cost.*

Deploy a cloud-native tool once through git, then flick it on from a browser when I want to test, and off when I'm done. I only pay while a switch is up. Scale-to-zero stops being a billing footnote and becomes a button I actually press.

Repo: [github.com/Gitrexx/service-switch](https://github.com/Gitrexx/service-switch).
