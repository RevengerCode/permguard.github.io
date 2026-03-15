---
id: azclient
title: AuthZClient
sidebar_label: AuthZClient
sidebar_position: 2
description: This section provides instructions for using the AuthZClient in the Go SDK.
---
The application, acting as a Policy Enforcement Point (PEP), enforces policies defined by the Policy Decision Point (PDP). The Permguard Go SDK facilitates communication with the Permguard PDP.

This communication occurs through the `AuthZClient`, a component that provides a straightforward interface for interacting with the Permguard `Server`.

## The Basic Structure of an Authorization Request

A standard authorization request is composed of the following key elements:

```go
// Create a new Permguard client
azClient := permguard.NewAZClient(
  permguard.WithEndpoint("localhost", 9094),
)

// Create a new authorization request
req := azreq.NewAZAtomicRequestBuilder(836576733282, "9c08015ca0fe46e9b0b54179cbd22bf3",
  "amy.smith@pharmago.com", "PharmaGovFlow::Platform::Branch", "PharmaGovFlow::Platform::Action::create")

// Check the authorization
decision, _, _ := azClient.Check(req)
if decision {
  fmt.Println("✅ Authorization Permitted")
} else {
  fmt.Println("❌ Authorization Denied")
}
```

## Perform an Atomic Authorization Request

An `atomic authorization` request can be performed using the `AuthZClient` by creating a new client instance and invoking the `Check` method.

```go
// Create a new Permguard client
azClient := permguard.NewAZClient(
  permguard.WithEndpoint("localhost", 9094),
)

// Create the Principal
principal := azreq.NewPrincipalBuilder("amy.smith@pharmago.com").
  WithType("user").
  WithSource("keycloak").
  Build()

// Create the entities
entities := []map[string]any{
  {
    "uid": map[string]any{
      "type": "PharmaGovFlow::Platform::Branch",
      "id":   "fb008a600df04b21841c4fb5ad27ddf7",
    },
    "attrs": map[string]any{
      "status": "active",
    },
    "parents": []any{},
  },
}

// Create a new authorization request
req := azreq.NewAZAtomicRequestBuilder(836576733282, "9c08015ca0fe46e9b0b54179cbd22bf3",
  "amy.smith@pharmago.com", "PharmaGovFlow::Platform::Branch", "PharmaGovFlow::Platform::Action::create").
  // RequestID
  WithRequestID("1234").
  // Principal
  WithPrincipal(principal).
  // Entities
  WithEntitiesItems(azreq.CedarEntityKind, entities).
  // Subject
  WithSubjectType(azreq.UserType).
  // Resource
  WithResourceID("fb008a600df04b21841c4fb5ad27ddf7").
  WithResourceProperty("status", "active").
  WithContextProperty("time", "2025-01-23T16:17:46+00:00").
  Build()

// Check the authorization
decision, response, _ := azClient.Check(req)
if decision {
  fmt.Println("✅ Authorization Permitted")
} else {
  fmt.Println("❌ Authorization Denied")
  if response.Context.ReasonAdmin != nil {
    fmt.Printf("-> Reason Admin: %s\n", response.Context.ReasonAdmin.Message)
  }
  if response.Context.ReasonUser != nil {
    fmt.Printf("-> Reason User: %s\n", response.Context.ReasonUser.Message)
  }
  for _, eval := range response.Evaluations {
    if eval.Context.ReasonUser != nil {
      fmt.Printf("-> Reason Admin: %s\n", eval.Context.ReasonAdmin.Message)
      fmt.Printf("-> Reason User: %s\n", eval.Context.ReasonUser.Message)
    }
  }
}
```

## Perform a Composed Authorization Request

To perform a composed authorization request using the `AuthZClient`, you need to create a new client and call the `Check` method.

:::note
This type of request is designed for scenarios requiring greater control over the authorization request creation, as well as cases where multiple evaluations must be executed within a single request.
:::

```go
// Create a new Permguard client
azClient := permguard.NewAZClient(
  permguard.WithEndpoint("localhost", 9094),
)

// Create a new subject
subject := azreq.NewSubjectBuilder("amy.smith@pharmago.com").
  WithType(azreq.UserType).
  Build()

// Create a new resource
resource := azreq.NewResourceBuilder("PharmaGovFlow::Platform::Branch").
  WithID("fb008a600df04b21841c4fb5ad27ddf7").
  WithProperty("status", "active").
  Build()

// Create actions
actionView := azreq.NewActionBuilder("PharmaGovFlow::Platform::Action::view").
  Build()

actionCreate := azreq.NewActionBuilder("PharmaGovFlow::Platform::Action::create").
  Build()

// Create a new Context
context := azreq.NewContextBuilder().
  WithProperty("time", "2025-01-23T16:17:46+00:00").
  Build()

// Create evaluations
evaluationView := azreq.NewEvaluationBuilder(subject, resource, actionView).
  WithRequestID("1234").
  WithContext(context).
  Build()

evaluationCreate := azreq.NewEvaluationBuilder(subject, resource, actionCreate).
  WithRequestID("7890").
  WithContext(context).
  Build()

// Create the Principal
principal := azreq.NewPrincipalBuilder("amy.smith@pharmago.com").
  WithType("user").
  WithSource("keycloak").
  Build()

// Create the entities
entities := []map[string]any{
  {
    "uid": map[string]any{
      "type": "PharmaGovFlow::Platform::Branch",
      "id":   "fb008a600df04b21841c4fb5ad27ddf7",
    },
    "attrs": map[string]any{
      "status": "active",
    },
    "parents": []any{},
  },
}

// Create a new authorization request
req := azreq.NewAZRequestBuilder(836576733282, "9c08015ca0fe46e9b0b54179cbd22bf3").
  WithPrincipal(principal).
  WithEntitiesItems(azreq.CedarEntityKind, entities).
  WithEvaluation(evaluationView).
  WithEvaluation(evaluationCreate).
  Build()

// Check the authorization
decision, response, _ := azClient.Check(req)
if decision {
  fmt.Println("✅ Authorization Permitted")
} else {
  fmt.Println("❌ Authorization Denied")
  if response.Context.ReasonAdmin != nil {
    fmt.Printf("-> Reason Admin: %s\n", response.Context.ReasonAdmin.Message)
  }
  if response.Context.ReasonUser != nil {
    fmt.Printf("-> Reason User: %s\n", response.Context.ReasonUser.Message)
  }
  for _, eval := range response.Evaluations {
    if eval.Context.ReasonUser != nil {
      fmt.Printf("-> Reason Admin: %s\n", eval.Context.ReasonAdmin.Message)
      fmt.Printf("-> Reason User: %s\n", eval.Context.ReasonUser.Message)
    }
  }
}
```
