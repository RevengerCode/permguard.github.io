---
id: azclient
title: AuthZClient
sidebar_label: AuthZClient
sidebar_position: 2
description: This section provides instructions for using the AuthZClient in the Node SDK.
---

The application, acting as a Policy Enforcement Point (PEP), enforces policies defined by the Policy Decision Point (PDP). The Permguard Node SDK facilitates communication with the Permguard PDP.

This communication occurs through the `AuthZClient`, a component that provides a straightforward interface for interacting with the Permguard `Server`.

## The Basic Structure of an Authorization Request

A standard authorization request is composed of the following key elements:

```typescript
import { withEndpoint, AZClient } from "@permguard/permguard";

// Create a new Permguard client
const azClient = new AZClient(withEndpoint("localhost", 9094));

// Check the authorization
const { decision, response } = await azClient.check(json_ok_onlyone);
if (decision) {
  console.log("✅ Authorization Permitted");
} else {
  console.log("❌ Authorization Denied");
  if (response) {
    if (response.Context?.ReasonAdmin) {
      console.log(`-> Reason Admin: ${response.Context.ReasonAdmin.Message}`);
    }
    if (response.Context?.ReasonUser) {
      console.log(`-> Reason User: ${response.Context.ReasonUser.Message}`);
    }
    for (const evaluation of response.Evaluations || []) {
      if (evaluation.Context?.ReasonAdmin) {
        console.log(
          `-> Reason Admin: ${evaluation.Context.ReasonAdmin.Message}`
        );
      }
      if (evaluation.Context?.ReasonUser) {
        console.log(`-> Reason User: ${evaluation.Context.ReasonUser.Message}`);
      }
    }
  }
}
```

## Perform an Atomic Authorization Request

An `atomic authorization` request can be performed using the `AuthZClient` by creating a new client instance and invoking the `Check` method.

```typescript
import {
  PrincipalBuilder,
  AZAtomicRequestBuilder,
  withEndpoint,
  AZClient,
} from "@permguard/permguard";

// Create a new Permguard client
const azClient = new AZClient(withEndpoint("localhost", 9094));

// Create the Principal
const principal = new PrincipalBuilder("amy.smith@pharmago.com").withType("user").withSource("keycloak").build();

// Create the entities
const entities = [
  {
    uid: {
      type: "PharmaGovFlow::Platform::Branch",
      id: "fb008a600df04b21841c4fb5ad27ddf7",
    },
    attrs: {
      status: "active",
    },
    parents: [],
  },
];

// Create a new authorization request
const req = new AZAtomicRequestBuilder(
  836576733282,
  "9c08015ca0fe46e9b0b54179cbd22bf3",
  "amy.smith@pharmago.com",
  "PharmaGovFlow::Platform::Branch",
  "PharmaGovFlow::Platform::Action::create"
)
  .withRequestID("1234")
  .withPrincipal(principal)
  .withEntitiesItems("cedar", entities)
  .withSubjectUserType()
  .withResourceID("fb008a600df04b21841c4fb5ad27ddf7")
  .withResourceProperty("status", "active")
  .withContextProperty("time", "2025-01-23T16:17:46+00:00")
  .build();

// Check the authorization
const { decision, response } = await azClient.check(req);
if (decision) {
  console.log("✅ Authorization Permitted");
} else {
  console.log("❌ Authorization Denied");
  if (response) {
    if (response.Context?.ReasonAdmin) {
      console.log(`-> Reason Admin: ${response.Context.ReasonAdmin.Message}`);
    }
    if (response.Context?.ReasonUser) {
      console.log(`-> Reason User: ${response.Context.ReasonUser.Message}`);
    }
    for (const evaluation of response.Evaluations || []) {
      if (evaluation.Context?.ReasonAdmin) {
        console.log(
          `-> Reason Admin: ${evaluation.Context.ReasonAdmin.Message}`
        );
      }
      if (evaluation.Context?.ReasonUser) {
        console.log(`-> Reason User: ${evaluation.Context.ReasonUser.Message}`);
      }
    }
  }
}
```

## Perform a Composed Authorization Request

To perform a composed authorization request using the `AuthZClient`, you need to create a new client and call the `Check` method.

:::note
This type of request is designed for scenarios requiring greater control over the authorization request creation, as well as cases where multiple evaluations must be executed within a single request.
:::

```typescript
import {
  PrincipalBuilder,
  withEndpoint,
  AZClient,
  SubjectBuilder,
  ResourceBuilder,
  ActionBuilder,
  ContextBuilder,
  EvaluationBuilder,
  AZRequestBuilder,
} from "@permguard/permguard";

// Create a new Permguard client
const azClient = new AZClient(withEndpoint("localhost", 9094));

// Create a new subject
const subject = new SubjectBuilder("amy.smith@pharmago.com")
  .withUserType()
  .build();

// Create a new resource
const resource = new ResourceBuilder("PharmaGovFlow::Platform::Branch")
  .withID("fb008a600df04b21841c4fb5ad27ddf7")
  .withProperty("status", "active")
  .build();

// Create actions
const actionView = new ActionBuilder("PharmaGovFlow::Platform::Action::view")
  .build();

const actionCreate = new ActionBuilder(
  "PharmaGovFlow::Platform::Action::create"
)
  .build();

// Create a new Context
const context = new ContextBuilder()
  .withProperty("time", "2025-01-23T16:17:46+00:00")
  .build();

// Create evaluations
const evaluationView = new EvaluationBuilder(subject, resource, actionView)
  .withRequestID("1234")
  .withContext(context)
  .build();

const evaluationCreate = new EvaluationBuilder(subject, resource, actionCreate)
  .withRequestID("7890")
  .withContext(context)
  .build();

// Create the Principal
const principal = new PrincipalBuilder("amy.smith@pharmago.com").withType("user").withSource("keycloak").build();

// Create the entities
const entities = [
  {
    uid: {
      type: "PharmaGovFlow::Platform::Branch",
      id: "fb008a600df04b21841c4fb5ad27ddf7",
    },
    attrs: {
      status: "active",
    },
    parents: [],
  },
];

// Create a new authorization request
const req = new AZRequestBuilder(
  836576733282,
  "9c08015ca0fe46e9b0b54179cbd22bf3"
)
  .withPrincipal(principal)
  .withEntitiesItems("cedar", entities)
  .withEvaluation(evaluationView)
  .withEvaluation(evaluationCreate)
  .build();

// Check the authorization
const { decision, response } = await azClient.check(req);
if (decision) {
  console.log("✅ Authorization Permitted");
} else {
  console.log("❌ Authorization Denied");
  if (response) {
    if (response.Context?.ReasonAdmin) {
      console.log(`-> Reason Admin: ${response.Context.ReasonAdmin.Message}`);
    }
    if (response.Context?.ReasonUser) {
      console.log(`-> Reason User: ${response.Context.ReasonUser.Message}`);
    }
    for (const evaluation of response.Evaluations || []) {
      if (evaluation.Context?.ReasonAdmin) {
        console.log(
          `-> Reason Admin: ${evaluation.Context.ReasonAdmin.Message}`
        );
      }
      if (evaluation.Context?.ReasonUser) {
        console.log(`-> Reason User: ${evaluation.Context.ReasonUser.Message}`);
      }
    }
  }
}
```
