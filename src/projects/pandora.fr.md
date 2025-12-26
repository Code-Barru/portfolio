---
title: Pandora
featured: false
date: '2024-08-02'
description: Premier essai de faire un serveur C2. Discord sert de C2 et l'agent a de la persistence
tags:
  - rust
  - c2
  - discordjs
  - maldev
github: https://github.com/Code-Barru/icarus
status: 'archived'
---

Petit RAT écrit en Rust pour l'agent et Typescript pour le C2.

Le C2 est controllé via un bot Discord. Il faut regarde dans `server/data/config_example.json` pour savoir comment mettre le bot en place.

## Fonctionnalités 

- Persistence
- Reverse shell (powershell)
- Affiche les informations système
- Provoque une bluescreen sur le pc avec un agent
- Auto-suppression

