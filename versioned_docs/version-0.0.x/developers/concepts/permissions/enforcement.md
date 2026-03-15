---
id: enforcement
title: Enforcement
sidebar_label: Enforcement
sidebar_position: 5
description: Understanding the concept of Enforcement in Permguard.
---

In **Permguard**, enforcement is handled by the **Policy Enforcement Point (PEP)**.
Its role is to verify whether an `identity` has permission to perform specific `actions` on `resources` within a given `namespace`.

:::note
In the [PharmaGovFlow example](../../../learn/pharma-govflow/), the application enforces different types of permission checks.
:::

## Enforcement

To enforce access control, the **PEP** queries the **Policy Decision Point (PDP)** for a decision.

```json
{
  "authorization_model": {
    "zone_id": 836576733282,
    "policy_store": {
      "kind": "ledger",
      "id": "9c08015ca0fe46e9b0b54179cbd22bf3"
    },
    "principal": {
      "type": "user",
      "id": "amy.smith@pharmago.com",
      "source": "keycloak"
    },
    "entities": {
      "schema": "cedar",
      "items": [
        {
          "uid": {
            "type": "PharmaGovFlow::Platform::Branch",
            "id": "fb008a600df04b21841c4fb5ad27ddf7"
          },
          "attrs": {
            "status": "active"
          },
          "parents": []
        }
      ]
    }
  },
  "subject": {
    "type": "user",
    "id": "amy.smith@pharmago.com"
  },
  "resource": {
    "type": "PharmaGovFlow::Platform::Branch",
    "id": "fb008a600df04b21841c4fb5ad27ddf7"
  },
  "context": {
    "time": "2025-01-23T16:17:46+00:00"
  },
  "evaluations": [
    {
      "action": {
        "name": "PharmaGovFlow::Platform::Action::create"
      }
    },
    {
      "action": {
        "name": "PharmaGovFlow::Platform::Action::deactivate"
      }
    }
  ]
}
```
