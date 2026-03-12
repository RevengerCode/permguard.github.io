---
id: options
title: Options
sidebar_label: Options
sidebar_position: 2
description: Overview of the deployment options.
---

Permguard can be configured using either environment variables or CLI options. Each CLI option has a corresponding environment variable named `PERMGUARD_<OPTION_NAME>`. For example, `--debug` maps to `PERMGUARD_DEBUG`.

For general options, see [General Options](../../developers/deployment/options.md).

## Data Plane

<!-- updated: added shared server flags (notp, otel) to match source code -->
| Option | Default | Description |
|--------|---------|-------------|
| `--server-appdata` | `./` | Directory used as application data |
| `--storage-engine-central` | `SQLITE` | Storage engine for central data |
| `--server-notp-max-packet-size` | `16777216` | NOTP maximum packet size in bytes (16MB) |
| `--server-otel-enabled` | `false` | Enable OpenTelemetry tracing and metrics |
| `--server-otel-endpoint` | `localhost:4317` | OpenTelemetry collector gRPC endpoint |
| `--server-otel-sample-rate` | `0.1` | OpenTelemetry trace sample rate (0.0 to 1.0) |

### PIP — Policy Information Point

| Option | Default | Description |
|--------|---------|-------------|
| `--storage-pip-engine-central` | `SQLITE` | Storage engine (overrides `--storage-engine-central`) |
| `--server-pip-data-fetch-maxpagesize` | `10000` | Max items per request |
| `--server-pip-grpc-port` | `9093` | gRPC port |

### PDP — Policy Decision Point

| Option | Default | Description |
|--------|---------|-------------|
| `--storage-pdp-engine-central` | `SQLITE` | Storage engine (overrides `--storage-engine-central`) |
| `--server-pdp-data-fetch-maxpagesize` | `10000` | Max items per request |
| `--server-pdp-grpc-port` | `9094` | gRPC port |
| `--server-pdp-decision-log` | `NONE` | Decision log output: `NONE`, `STDOUT`, `FILE` |
