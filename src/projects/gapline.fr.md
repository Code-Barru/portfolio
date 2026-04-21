---
title: Gapline
featured: true
date: '2026-04-19'
description: Chaîne d'outils GTFS tout-en-un — CLI Rust + SaaS collaborative bâties sur un cœur partagé pour les équipes transit.
tags:
  - rust
  - gtfs
  - cli
  - tool
  - saas
demoUrl: https://gapline.dev
status: 'in-progress'
---
Gapline est une plateforme de données transit à deux produits bâtie autour d'un cœur Rust partagé : une CLI open-source pour les workflows GTFS locaux, et une SaaS collaborative (en cours) qui traite le GTFS comme un produit vivant — versionné, reviewable, simulable face à la réalité d'exploitation.
## Pourquoi ce projet ?
Le GTFS (General Transit Feed Specification) est le standard derrière toutes les applis de transport en commun — calculateurs d'itinéraires, cartes, afficheurs temps réel. Pourtant l'outillage que les opérateurs et data engineers utilisent pour produire, valider et maintenir ces feeds est resté coincé dans le passé :
1. Un écosystème fragmenté — un outil pour la validation, un autre pour l'édition, un troisième pour le merge, un quatrième pour le diff
2. Des validateurs Java/Python lents qui s'étouffent sur des feeds à plusieurs millions de lignes dans `stop_times.txt`
3. Des validateurs hébergés qui obligent les opérateurs à envoyer des données réseau sensibles à des tiers sans aucune garantie de confidentialité
4. Aucun versioning, aucun workflow de review, aucune piste d'audit entre révisions — on écrase les feeds sur place comme en 2005
5. Aucun moyen de simuler l'impact d'un changement de réseau avant de le publier, et aucun pont entre l'horaire théorique et ce qui se passe vraiment en exploitation
6. Des scripts maison qui cassent à chaque edge case que la spec définit
Gapline écrase ce bazar dans une plateforme unique et cohérente — local-first quand tu as besoin de confidentialité et de vitesse, collaborative quand tu as besoin de traçabilité et de simulation.
## CLI — shippée
La CLI open-source est distribuée via `cargo install gapline` et utilise des sous-commandes à la `git` (`validate`, `read`, `create`, `update`, `delete`, `run`).
- **Moteur de validation exhaustif** : un pipeline à 6 sections avec gates et plus de 60 règles couvrant la structure des fichiers, le formatage CSV (RFC 4180, UTF-8 avec BOM), le typage des champs, les clés étrangères, l'unicité des clés primaires, et les règles sémantiques comme la monotonie des `stop_sequence` ou la détection de chevauchement de `frequencies`. Parsing et exécution des règles en parallèle via `rayon`, avec barres de progression par section.
- **17 types de fichiers GTFS parsés** : agency, stops, routes, trips, stop_times, calendar, calendar_dates, shapes, frequencies, transfers, pathways, levels, feed_info, fare_attributes, fare_rules, translations, attributions.
- **Intégrité référentielle garantie** : un index inverse bidirectionnel couvrant les 12+ relations FK du GTFS. Les opérations CRUD qui briseraient l'intégrité sont rejetées avec la chaîne de dépendances complète ; les suppressions en cascade exigent une confirmation explicite listant chaque enregistrement impacté.
- **CRUD complet avec mini-langage de requête** : filtrage `--where`, `--set` pour les mises à jour, `--confirm` pour l'automatisation non-interactive en CI.
- **Fichiers batch `.hw`** : scripts basés sur des sessions avec directives `feed` / `save`. Toutes les opérations s'exécutent en mémoire, sans I/O disque répété entre les étapes — valider, corriger, re-valider, exporter, le tout depuis un fichier versionné avec le pipeline de données.
- **Sorties multi-format** : texte coloré en terminal (par défaut, avec détection TTY), JSON, XML, CSV, HTML. Autocomplétion shell pour bash, zsh, fish. Config TOML à trois niveaux (projet > utilisateur > défauts).
## SaaS Cloud — en cours
La plateforme hébergée (propriétaire) est construite en six phases au-dessus du même crate core. Elle vise les opérateurs et agences dont les besoins dépassent ce qu'un outil local sans état peut offrir.
- **Versioning à la Git** des données GTFS : snapshots immutables, diffs sémantiques au niveau entité (arrêts, lignes, voyages ajoutés/supprimés/modifiés), historique complet et rollback.
- **Workflow de review collaboratif** : états draft → review → approved → published, permissions par rôle, notifications in-app, commentaires sur les diffs.
- **Publication versionnée** avec URLs stables par tenant et webhooks (retry + backoff) pour les consommateurs downstream (calculateurs d'itinéraires, systèmes d'information voyageurs).
- **Simulation d'impact de changement réseau** : un moteur d'isochrones basé sur RAPTOR calcule l'accessibilité avant et après une modification proposée. Les deltas de couverture de population sont calculés via des jointures spatiales PostGIS sur données INSEE — visualiser combien de citoyens gagnent ou perdent un service avant publication.
- **Pont théorique-vs-réel** : ingestion GTFS-RT en Protobuf (via `prost`), moteur de matching qui rattache les mises à jour temps réel aux courses planifiées, dashboards qui exposent ponctualité, annulations et patterns de sauts d'arrêts dans le temps.
## Stack & architecture
- **Workspace Rust en trois crates** : `core` (MIT) porte toute la logique métier — parsing, validation, intégrité, diffs, RAPTOR. `cli` (GPL) et `server` (propriétaire) sont des interfaces fines qui consomment le core. Zéro logique métier en-dehors du core, ce qui garantit une correction identique entre usage local et hébergé.
- **Le core est synchrone** ; l'async vit uniquement dans la couche serveur (`spawn_blocking` fait le pont). Des `HashMap` en index inverse portent l'intégrité référentielle — aucune lib de graphe, aucune allocation cachée.
- **Backend** : Axum + SQLx + JWT, PostgreSQL avec l'extension PostGIS pour les requêtes spatiales.
- **Frontend** : SPA SvelteKit (`adapter-static`) servie par Axum avec fallback SPA, MapLibre GL pour la cartographie interactive (vues réseau, isochrones, heatmaps de couverture).
- **Stratégie de double licence** : MIT sur le core pour que l'écosystème puisse embarquer le moteur de validation n'importe où ; GPL sur la CLI pour garder les améliorations utilisateur ouvertes ; la plateforme hébergée reste propriétaire comme différenciation commerciale.
Pour en savoir plus, cliquer sur ce [lien](https://github.com/Code-Barru/gapline).
