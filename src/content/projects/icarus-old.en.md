---
title: Icarus v1
featured: false
date: '2024-10-07'
description: Second attempt at C2 server. Featuring a webUI and persistence.
tags:
  - rust
  - c2
  - maldev
  - devops
  - sveltejs
status: 'archived'
github: 'https://github.com/Code-Barru/icarus'
---

A Command and Control server and his agent written in Rust🦀!

## Features

- 👨‍💻 AES-256 encrypted traffic
- 🔃 Agent auto update
- 🤠 Agent persistence
- 📔 Task Queuing

## Installation

### Pre-requisites

Have Rust installed on your machine. You can install it by following the instructions on the [official website](https://www.rust-lang.org/tools/install).

### Clone the repository

```sh
git clone https://github.com/Code-Barru/icarus.git
cd icarus
```

Change the Server addr in `setup/main.rs`.

### Build the project

```sh
cargo build --release
```

### Launch the database

```sh
docker-compose up -d
```

### Setup environment variables

```sh
export DATABASE_URL=postgres://icarus:icarus@localhost/icarus
export RSA_PRIVATE_KEY_PATH=path/to/private_key.pem # Optional, default is private_key.pem
export RUST_LOG={info,debug,error,trace} # Optional, default is info
```

Can also be set in a `.env` file.

### Apply the migrations

```sh
cd server
diesel migration run
```

### Create server distribution folder && copy binaries

```sh
mkdir dist
cp ../target/release/agent.exe dist/
cp ../target/release/setup.exe dist/
```

### Launch the server

```sh
cargo run -p server --release
```

You now just have to upload "setup" to the target !
