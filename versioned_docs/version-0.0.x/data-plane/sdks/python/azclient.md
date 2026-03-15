---
id: azclient
title: AuthZClient
sidebar_label: AuthZClient
sidebar_position: 2
description: This section provides instructions for using the AuthZClient in the Python SDK.
---

The application, acting as a Policy Enforcement Point (PEP), enforces policies defined by the Policy Decision Point (PDP). The Permguard Python SDK facilitates communication with the Permguard PDP.

This communication occurs through the `AuthZClient`, a component that provides a straightforward interface for interacting with the Permguard `Server`.

## The Basic Structure of an Authorization Request

A standard authorization request is composed of the following key elements:

```python
with open("./examples/cmd/requests/ok_onlyone1.json", "r") as f:
    json_file = f.read()

az_client = AZClient(with_endpoint("localhost", 9094))

try:
    req = AZRequest.model_validate_json(json_file)
except json.JSONDecodeError:
    print("❌ Authorization request deserialization failed")
    return

ok, response = az_client.check(req)

if ok:
    print("✅ authorization permitted")
else:
    print("❌ authorization denied")
    if response and response.context:
        if response.context.reason_admin:
            print(f"-> reason admin: {response.context.reason_admin.message}")
        if response.context.reason_user:
            print(f"-> reason user: {response.context.reason_user.message}")
        for eval in response.evaluations:
            if eval.context and eval.context.reason_user:
                print(f"-> reason admin: {eval.context.reason_admin.message}")
                print(f"-> reason user: {eval.context.reason_user.message}")
    if response and response.evaluations:
        for eval in response.evaluations:
            if eval.context:
                if eval.context.reason_admin:
                    print(f"-> evaluation requestid {eval.request_id}: reason admin: {eval.context.reason_admin.message}")
                if eval.context.reason_user:
                    print(f"-> evaluation requestid {eval.request_id}: reason user: {eval.context.reason_user.message}")
```

## Perform an Atomic Authorization Request

An `atomic authorization` request can be performed using the `AuthZClient` by creating a new client instance and invoking the `Check` method.

```python
az_client = AZClient(with_endpoint("localhost", 9094))

principal = PrincipalBuilder("amy.smith@pharmago.com").with_type("user").with_source("keycloak").build()

entities = [
    {
        "uid": {"type": "PharmaGovFlow::Platform::Branch", "id": "fb008a600df04b21841c4fb5ad27ddf7"},
        "attrs": {"status": "active"},
        "parents": [],
    }
]

req = (
    AZAtomicRequestBuilder(
        836576733282,
        "9c08015ca0fe46e9b0b54179cbd22bf3",
        "amy.smith@pharmago.com",
        "PharmaGovFlow::Platform::Branch",
        "PharmaGovFlow::Platform::Action::create",
    )
    .with_request_id("1234")
    .with_principal(principal)
    .with_entities_items("cedar", entities)
    .with_subject_user_type()
    .with_resource_id("fb008a600df04b21841c4fb5ad27ddf7")
    .with_resource_property("status", "active")
    .with_context_property("time", "2025-01-23T16:17:46+00:00")
    .build()
)

ok, response = az_client.check(req)

if ok:
    print("✅ authorization permitted")
else:
    print("❌ authorization denied")
    if response and response.context:
        if response.context.reason_admin:
            print(f"-> reason admin: {response.context.reason_admin.message}")
        if response.context.reason_user:
            print(f"-> reason user: {response.context.reason_user.message}")
        for eval in response.evaluations:
            if eval.context and eval.context.reason_user:
                print(f"-> reason admin: {eval.context.reason_admin.message}")
                print(f"-> reason user: {eval.context.reason_user.message}")
    if response and response.evaluations:
        for eval in response.evaluations:
            if eval.context:
                if eval.context.reason_admin:
                    print(f"-> evaluation requestid {eval.request_id}: reason admin: {eval.context.reason_admin.message}")
                if eval.context.reason_user:
                    print(f"-> evaluation requestid {eval.request_id}: reason user: {eval.context.reason_user.message}")
```

## Perform a Composed Authorization Request

To perform a composed authorization request using the `AuthZClient`, you need to create a new client and call the `Check` method.

:::note
This type of request is designed for scenarios requiring greater control over the authorization request creation, as well as cases where multiple evaluations must be executed within a single request.
:::

```python
az_client = AZClient(with_endpoint("localhost", 9094))

subject = (
    SubjectBuilder("amy.smith@pharmago.com")
    .with_user_type()
    .build()
)

resource = (
    ResourceBuilder("PharmaGovFlow::Platform::Branch")
    .with_id("fb008a600df04b21841c4fb5ad27ddf7")
    .with_property("status", "active")
    .build()
)

action_view = ActionBuilder("PharmaGovFlow::Platform::Action::view").build()
action_create = ActionBuilder("PharmaGovFlow::Platform::Action::create").build()

context = (
    ContextBuilder()
    .with_property("time", "2025-01-23T16:17:46+00:00")
    .build()
)

evaluation_view = EvaluationBuilder(subject, resource, action_view).with_request_id("1234").with_context(context).build()
evaluation_create = EvaluationBuilder(subject, resource, action_create).with_request_id("7890").with_context(context).build()

principal = PrincipalBuilder("amy.smith@pharmago.com").with_type("user").with_source("keycloak").build()

entities = [
    {
        "uid": {"type": "PharmaGovFlow::Platform::Branch", "id": "fb008a600df04b21841c4fb5ad27ddf7"},
        "attrs": {"status": "active"},
        "parents": [],
    }
]

req = (
    AZRequestBuilder(836576733282, "9c08015ca0fe46e9b0b54179cbd22bf3")
    .with_principal(principal)
    .with_entities_items("cedar", entities)
    .with_evaluation(evaluation_view)
    .with_evaluation(evaluation_create)
    .build()
)

ok, response = az_client.check(req)

if ok:
    print("✅ authorization permitted")
else:
    print("❌ authorization denied")
    if response and response.context:
        if response.context.reason_admin:
            print(f"-> reason admin: {response.context.reason_admin.message}")
        if response.context.reason_user:
            print(f"-> reason user: {response.context.reason_user.message}")
        for eval in response.evaluations:
            if eval.context and eval.context.reason_user:
                print(f"-> reason admin: {eval.context.reason_admin.message}")
                print(f"-> reason user: {eval.context.reason_user.message}")
    if response and response.evaluations:
        for eval in response.evaluations:
            if eval.context:
                if eval.context.reason_admin:
                    print(f"-> evaluation requestid {eval.request_id}: reason admin: {eval.context.reason_admin.message}")
                if eval.context.reason_user:
                    print(f"-> evaluation requestid {eval.request_id}: reason user: {eval.context.reason_user.message}")
```
