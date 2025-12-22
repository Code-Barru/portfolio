---
title: Staging Shellcode
featured: false
date: '2025-03-06'
description: Small PoC that fetches a payload from a server and inject it into running processes.
tags:
  - rust
  - shellcode
  - injection
  - maldev
github: https://github.com/Code-Barru/staging-shellcode
status: 'completed'
---

This project is a small proof of concept (PoC) written in Rust. It demonstrates how to fetch a payload from a server and inject it into running processes based on their executable name. The main steps involved in this PoC are:

1. **Fetching the Payload**: The program connects to a specified server to download the payload (shellcode).
2. **Process Injection**: Once the payload is fetched, the program searches for running processes that match a given executable name.
3. **Injecting the Payload**: The payload is then injected into the identified processes, allowing the shellcode to execute within the context of those processes.

This PoC is intended for educational purposes to demonstrate techniques related to shellcode staging and process injection.

## Usage

To use this project, ensure you have the following installed:

- [Rust](https://www.rust-lang.org/tools/install)
- [Python](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)

### Steps to Run

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/Code-Barru/staging-shellcode.git
   cd staging-shellcode
   ```

2. **Build the Project**:
   ```sh
   cargo build --release
   ```
3. **Run the server**:

   ```sh
   python server.py
   ```

4. **Launch a notepad.exe process** (by default, the PoC injects the payload into notepad.exe, you can change this in main.rs line 4):

   ```sh
   notepad.exe
   ```

5. **Run the Project**:
   ```sh
   cargo run --release
   ```
