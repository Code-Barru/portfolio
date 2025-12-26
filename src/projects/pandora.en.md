---
title: Pandora
featured: false
date: '2024-08-02'
description: First attempt at C2 server. Discord C2 and agent with persistence.
tags:
  - rust
  - c2
  - discordjs
  - maldev
github: https://github.com/Code-Barru/pandoras
status: 'archived'
---

Small RAT written in Rust for the agent and Typescript for the C2.

The C2 is controlled via a Discord bot. Refer to `server/data/config_example.json` to know setup the bot.

## Features

- Persistence
- Reverse shell (powershell)
- Displays System's informations
- Make the agent's pc bluescreen
- Self delete

