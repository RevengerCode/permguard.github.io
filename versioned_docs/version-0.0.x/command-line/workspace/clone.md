---
id: clone
title: Clone
sidebar_label: Clone
sidebar_position: 3
description: Command reference for the `clone` command of the Permguard CLI.
---

Using the `clone` command, it is possible to clone a remote ledger locally.

```text
Usage:
  permguard clone [flags]

Flags:
  -h, --help            help for clone
      --pap int         specify the port number for the PAP (default 9092)
      --scheme string   specify the gRPC scheme: 'grpc' (plaintext) or 'grpcs' (TLS)
      --zap int         specify the port number for the ZAP (default 9091)

Global Flags:
  -o, --output string            output format (default "terminal")
      --spiffe-enabled           enable native SPIFFE mTLS via Workload API
      --spiffe-endpoint string   SPIFFE Workload API socket path (defaults to SPIFFE_ENDPOINT_SOCKET env)
      --tls-ca-file string       path to CA certificate for server verification (PEM)
      --tls-cert-file string     path to client certificate for mTLS (PEM)
      --tls-key-file string      path to client private key for mTLS (PEM)
      --tls-skip-verify          skip server certificate verification (insecure, dev only)
  -v, --verbose                  true for verbose output
  -w, --workdir string           workdir (default ".")
```

:::caution
The output from your current version of Permguard may differ from the example provided on this page.
:::

## Clone a ledger

The `permguard clone` command allows you to clone a remote ledger locally.

```bash
permguard clone permguard@localhost/273165098782/pharmagovflow
```

output:

```bash
Initialized empty permguard ledger in 'pharmagovflow'.
Remote origin has been added.
Ledger pharmagovflow has been added.
```

### Scheme prefix

The server part of the clone URI supports an optional scheme prefix (`grpc:` or `grpcs:`):

```bash
permguard clone permguard@grpcs:myserver.example.com/273165098782/pharmagovflow
```

The `--scheme` flag overrides the scheme prefix. When neither is provided, the scheme defaults to `grpc` (plaintext).

```bash
# explicit flag override
permguard clone permguard@localhost/273165098782/pharmagovflow --scheme grpcs
```

The resolved scheme is persisted in the workspace remote configuration and used for all subsequent operations (`checkout`, `pull`, `push`).

<!-- markdownlint-disable MD033 -->
<details>
  <summary>
    JSON Output
  </summary>

```bash
permguard clone permguard@localhost/273165098782/pharmagovflow --output json
```

output:

```json
{
  "ledgers": [
    {
      "is_head": true,
      "ref": "refs/remotes/origin/273165098782/fd1ac44e4afa4fc4beec622494d3175a",
      "ledger_id": "fd1ac44e4afa4fc4beec622494d3175a",
      "ledger_uri": "origin/273165098782/branches"
    }
  ]
}
```

</details>
