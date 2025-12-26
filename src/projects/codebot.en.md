---
title: Codebot
featured: false
date: '2022-11-01'
description: Discord bot that tracks LeagueOfLegends account lp gains.
tags:
  - discordjs
  - sql
github: https://github.com/Code-Barru/CodeBot-v3
status: 'archived'
---
Code-Bot is a Discord bot that can track wins and loses of League of Legends players.

It uses Riot Game's API and DiscordJS v13.

---
## Features

### Tracker LoL

- Track a player and display his wins and loses.
![Tracker LoL](https://i.ibb.co/JpJgj6R/queue.png)

- Link discord account to League account.
- Displays a League profile by providing account's name.
![Profile LoL](https://i.ibb.co/8m4CMBj/image.png)

---
## Commandes

### Tracker LoL
- `/traque <account>` adds an account at bot's tracking list.
- `/untraque <account>` removes an account from the bot's tracking list.
- `/traqueici` mark a discord channel as the one to log into.
- `/traqueliste` displays the bot's tracking list
- `/profilelol <account>` displays a League profile *(name, rank, tier, 5 last games)*
