---
id: managing-remotes
title: Managing Remotes
sidebar_label: Managing Remotes
sidebar_position: 2
description: Learn about managing remotes in a Permguard workspace
---

A recommended **Permguard** best practice is to run a **dedicated Server** for each environment, such as:

- **Development**
- **Staging**
- **Production**

This separation ensures a secure and isolated trust model aligned with the specific needs of each environment.

## Managing multiple Servers

When handling multiple **Servers** and provisioning configurations, it is crucial to correctly configure **remote connections**.
This setup enables smooth communication and coordination between different **Permguard instances**.

To add a new **remote**, use the following **remote command**:

```bash
 permguard remote add origin localhost
```

and it can be removed using the remote command:

```bash
 permguard remote remove origin
```

If the Server ports differ from the default values (`zap`:`9091` and `pap`:`9092`), you can specify the custom port numbers using the `--zap` and `--pap` flags:

```bash
 permguard remote add origin localhost --zap 9091 --pap 9092
```

### Configuring the gRPC scheme

The gRPC scheme (`grpc` for plaintext, `grpcs` for TLS) determines whether the connection to the remote server is encrypted. When no scheme is specified, it defaults to `grpc` (plaintext).

There are two ways to set the scheme:

#### Scheme prefix in the server argument

The server name can include a `grpc:` or `grpcs:` prefix:

```bash
 permguard remote add origin grpcs:myserver.example.com
```

This stores `myserver.example.com` as the server and `grpcs` as the scheme.

#### The `--scheme` flag

The `--scheme` flag explicitly sets the scheme and **always overrides** the scheme prefix:

```bash
 permguard remote add origin grpc:myserver.example.com --scheme grpcs
```

In this example, the scheme prefix `grpc:` is ignored and `grpcs` is used.

### Scheme persistence

The resolved scheme is persisted in the workspace configuration file (`.permguard/config`) and used for all subsequent operations (`checkout`, `pull`, `push`) on that remote.

:::warning
If the persisted scheme conflicts with the TLS flags at runtime (e.g., scheme is `grpc` but `--tls-skip-verify` is set), Permguard will return an error indicating the misconfiguration.
:::
