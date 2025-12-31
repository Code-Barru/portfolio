---
title: Icarus v1
featured: false
date: '2024-10-07'
description: Deuxième essai de faire un serveur C2. Avec une interface web intégrée et de la persistence.
tags:
  - rust
  - c2
  - maldev
  - devops
  - sveltejs
status: 'archived'
github: 'https://github.com/Code-Barru/icarus'
---

Un serveur de Commande et Contrôle et son agent écrit en Rust 🦀!

## Fonctionnalités

- 👨‍💻 Trafic encodé en AES-256
- 🔃 Auto update de l'agent
- 🤠 Persistence de l'agent
- 📔 File d'attente des tâches

## Installation

### Pré-requis

Avoir Rust et Docker d'installé.

### Cloner le repo

```sh
git clone https://github.com/Code-Barru/icarus.git
cd icarus
```

Changer l'adresse serveur dans `setup/main.rs`.

### Build le projet

```sh
cargo build --release
```

### Lancer la base de donnée

```sh
docker-compose up -d
```

### Mise en place des variables d'environnement

```sh
export DATABASE_URL=postgres://icarus:icarus@localhost/icarus
export RSA_PRIVATE_KEY_PATH=path/to/private_key.pem # Optional, default is private_key.pem
export RUST_LOG={info,debug,error,trace} # Optional, default is info
```

Les variables peuvent également être mise dans un `.env`.

### Appliquer les migrations

```sh
cd server
diesel migration run
```

### Créer le dossier de distribution et copier les fichiers binaires

```sh
mkdir dist
cp ../target/release/agent.exe dist/
cp ../target/release/setup.exe dist/
```

### Lancer le serveur

```sh
cargo run -p server --release
```

Maintenant il n'y a plus qu'à upload le "setup" sur le pc cible !
