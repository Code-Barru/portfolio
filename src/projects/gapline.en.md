---
title: Gapline
featured: true
date: '2026-04-19'
description: All-in-one GTFS toolchain — Rust CLI + collaborative SaaS built on a shared core for transit data teams.
tags:
  - rust
  - gtfs
  - cli
  - tool
  - saas
demoUrl: https://gapline.dev
status: 'in-progress'
---
Gapline is a two-product transit-data platform built around a shared Rust core: an open-source CLI for local GTFS workflows, and a collaborative SaaS (in progress) that treats GTFS as a living product — versioned, reviewable, simulatable against real-world operations.
## Why this project exists?
GTFS (General Transit Feed Specification) is the standard behind every public transit app — trip planners, maps, realtime arrival boards. Yet the tooling that agencies and data engineers use to produce, validate, and maintain these feeds is stuck in the past:
1. A fragmented ecosystem — one tool for validation, another for editing, a third for merging, a fourth for diffing
2. Slow Java/Python validators that choke on feeds with millions of rows in `stop_times.txt`
3. Cloud-hosted validators that force operators to ship sensitive network data to third parties with no privacy guarantees
4. No versioning, no review workflow, no audit trail between revisions — feeds are overwritten in place like it's 2005
5. No way to simulate the impact of a network change before publishing it, and no bridge between the theoretical schedule and what actually happens on the network
6. Team-specific ad-hoc scripts that break on every edge case the spec defines
Gapline collapses this mess into a single, coherent platform — local-first when you need privacy and speed, collaborative when you need traceability and simulation.
## CLI — shipped
The open-source CLI is distributed via `cargo install gapline` and uses `git`-style subcommands (`validate`, `read`, `create`, `update`, `delete`, `run`).
- **Comprehensive validation engine**: a 6-section gated pipeline with 60+ rules covering file structure, CSV formatting (RFC 4180, UTF-8 with BOM), field typing, foreign keys, primary key uniqueness, and semantic checks like stop-sequence monotonicity or frequency overlap detection. Parsing and rule execution run in parallel via `rayon`, with per-section progress bars.
- **17 GTFS file types parsed**: agency, stops, routes, trips, stop_times, calendar, calendar_dates, shapes, frequencies, transfers, pathways, levels, feed_info, fare_attributes, fare_rules, translations, attributions.
- **Referential integrity, enforced**: a bidirectional reverse-index across the 12+ foreign-key relationships of GTFS. CRUD operations that would break integrity are rejected with a full dependency chain; cascade deletes require explicit confirmation listing every affected record.
- **Full CRUD with a mini query language**: `--where` filtering, `--set` for field updates, `--confirm` for unattended automation in CI pipelines.
- **`.hw` batch files**: session-based scripts with `feed` / `save` directives. All operations execute in memory, without repeated disk I/O between steps — validate, fix, re-validate, export, all from one file committed alongside your data pipeline.
- **Multi-format output**: colored terminal text (default, with TTY detection), JSON, XML, CSV, HTML. Shell completion for bash, zsh, fish. Three-tier TOML configuration (project > user > defaults).
## Cloud SaaS — in progress
The hosted platform (proprietary) is being built in six phases on top of the same core crate. It targets transit agencies and operators whose needs go beyond what a stateless local tool can deliver.
- **Git-like versioning** of GTFS data with immutable snapshots, semantic diffs at entity level (added/removed/modified stops, routes, trips), full history, and rollback.
- **Collaborative review workflow**: draft → review → approved → published states, role-based permissions, in-app notifications, comments on diffs.
- **Versioned publication** with stable URLs per tenant and webhooks with retry/backoff for downstream consumers (trip planners, passenger information systems).
- **Network-change impact simulation**: a RAPTOR-based isochrone engine computes reachability before and after a proposed edit. Population coverage deltas are calculated via PostGIS spatial joins against census data — see how many citizens gain or lose service before you publish.
- **Theoretical-vs-actual bridge**: GTFS-RT Protobuf ingestion (via `prost`), a matching engine that links real-time trip updates to scheduled trips, and dashboards surfacing punctuality, cancellations, and stop-skip patterns over time.
## Tech & architecture
- **Rust workspace with three crates**: `core` (MIT) holds every piece of business logic — parsing, validation, integrity, diffs, RAPTOR. `cli` (GPL) and `server` (proprietary) are thin interfaces that consume the core. Zero business logic outside the core, guaranteeing identical correctness between local and hosted usage.
- **The core is synchronous**; async lives only in the server layer (`spawn_blocking` bridges the two). Reverse-index `HashMap`s power referential integrity — no graph library, no hidden allocations.
- **Backend**: Axum + SQLx + JWT, PostgreSQL with the PostGIS extension for spatial queries.
- **Frontend**: SvelteKit SPA (`adapter-static`) served by Axum with SPA fallback, MapLibre GL for interactive cartography (network views, isochrones, coverage heatmaps).
- **Dual-license strategy**: MIT on the core lets the ecosystem embed the validation engine anywhere; GPL on the CLI keeps user-facing improvements open; the hosted platform stays proprietary as the commercial differentiator.
To learn more, click this [link](https://github.com/Code-Barru/gapline).
