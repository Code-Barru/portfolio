---
title: Codebot
featured: false
date: '2022-11-01'
description: Bot discord qui traque les gains de LP de comptes LeagueOfLegends
tags:
  - discordjs
  - sql
github: https://github.com/Code-Barru/CodeBot-v3
status: 'archived'
---

Code-Bot est un bot Discord permettant de tracker les victoires et défaites des joueurs de LeagueOfLegends.

Le bot utilise l'API de Riot Games, ainsi que DiscordJS v13.

---
## Fonctionnalités

### Tracker LoL

- Tracker un joueur et afficher ses victoires et défaites.  
![Tracker LoL](https://i.ibb.co/JpJgj6R/queue.png)

- Associer un compte discord à un compte League of Legends.
- Afficher un profile LoL en donnant le nom du compte.  
![Profile LoL](https://i.ibb.co/8m4CMBj/image.png)

---
## Commandes

### Tracker LoL
- `/traque <compte>` ajoute un compte à la liste de tracking du serveur
- `/untraque <compte>` enlève un compte à la liste de tracking du serveur
- `/traqueici` associe un channel Discord pour le tracking
- `/traqueliste` affiche la liste des joueurs track sur le serveurs
- `/profilelol <compte>` affiche un compte LoL *(nom, rank, tier, 5 dernières parties)*
