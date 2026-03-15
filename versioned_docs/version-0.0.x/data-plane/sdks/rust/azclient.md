---
id: azclient
title: AuthZClient
sidebar_label: AuthZClient
sidebar_position: 2
description: This section provides instructions for using the AuthZClient in the Rust SDK.
---

The application, acting as a Policy Enforcement Point (PEP), enforces policies defined by the Policy Decision Point (PDP). The Permguard Rust SDK facilitates communication with the Permguard PDP.

This communication occurs through the `AuthZClient`, a component that provides a straightforward interface for interacting with the Permguard `Server`.

## The Basic Structure of an Authorization Request

A standard authorization request is composed of the following key elements:

```rust
    let endpoint = AzEndpoint::new("http", 9094, "localhost");
    let config = AzConfig::new().with_endpoint(Some(endpoint));
    let client = AzClient::new(config);

    let mut file_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    file_path.push("./json/ok_onlyone.json");

    if !file_path.exists() {
        eprintln!("❌ Failed to load the JSON file");
        return Err(Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "Failed to load the JSON file",
        ))));
    }

    let json_content = fs::read_to_string(&file_path).await;
    let request: AzRequest = match serde_json::from_str(&json_content.unwrap()) {
        Ok(req) => req,
        Err(e) => {
            eprintln!("❌ Failed to parse JSON: {}", e);
            return Err(Err(Box::new(e) as Box<dyn std::error::Error>));
        }
    };

    match client.check_auth(Some(request)).await {
        Ok(response) => {
            if response.decision {
                println!("✅ Authorization Permitted");
            } else {
                println!("❌ Authorization Denied");
            }
        }
        Err(e) => {
            eprintln!("❌ Failed to check auth: {}", e);
            return Err(Err(e.into()));
        }
    }
```

## Perform an Atomic Authorization Request

An `atomic authorization` request can be performed using the `AuthZClient` by creating a new client instance and invoking the `Check` method.

```rust
    let endpoint = AzEndpoint::new("http", 9094, "localhost");
    let config = AzConfig::new().with_endpoint(Some(endpoint));
    let client = AzClient::new(config);

    let principal = PrincipalBuilder::new("amy.smith@pharmago.com")
        .with_source("keycloak")
        .with_type("user")
        .build();

    let entity = {
        let mut map = HashMap::new();
        map.insert("uid".to_string(), json!({
            "type": "PharmaGovFlow::Platform::Branch",
            "id": "fb008a600df04b21841c4fb5ad27ddf7"
        }));
        map.insert("attrs".to_string(), json!({"status": "active"}));
        map.insert("parents".to_string(), json!([]));
        Some(map)
    };

    let entities = vec![entity];

    let request = AzAtomicRequestBuilder::new(
        836576733282,
        "9c08015ca0fe46e9b0b54179cbd22bf3",
        "amy.smith@pharmago.com",
        "PharmaGovFlow::Platform::Branch",
        "PharmaGovFlow::Platform::Action::create",
    )
        .with_request_id("31243")
        .with_principal(principal)
        .with_subject_type("user")
        .with_resource_id("fb008a600df04b21841c4fb5ad27ddf7")
        .with_resource_property("status", json!("active"))
        .with_entities_map("cedar", entities)
        .with_context_property("time", json!("2025-01-23T16:17:46+00:00"))
        .build();

    match client.check_auth(Some(request)).await {
        Ok(response) => {
            if response.decision {
                println!("✅ Authorization Permitted");
            } else {
                println!("❌ Authorization Denied");
            }
        }
        Err(e) => {
            eprintln!("❌ Failed to check auth: {}", e);
            return Err(Err(e.into()));
        }
    }
```

## Perform a Composed Authorization Request

To perform a composed authorization request using the `AuthZClient`, you need to create a new client and call the `Check` method.

:::note
This type of request is designed for scenarios requiring greater control over the authorization request creation, as well as cases where multiple evaluations must be executed within a single request.
:::

```rust
    let endpoint = AzEndpoint::new("http", 9094, "localhost");
    let config = AzConfig::new().with_endpoint(Some(endpoint));
    let client = AzClient::new(config);

    // Create the Principal
    let principal = PrincipalBuilder::new("amy.smith@pharmago.com")
        .with_source("keycloak")
        .with_type("user")
        .build();

    // Create a new subject
    let subject = SubjectBuilder::new("amy.smith@pharmago.com")
        .with_type("user")
        .build();

    // Create a new resource
    let resource = ResourceBuilder::new("PharmaGovFlow::Platform::Branch")
        .with_id("fb008a600df04b21841c4fb5ad27ddf7")
        .with_property("status", serde_json::json!("active"))
        .build();

    // Create actions
    let action_view = ActionBuilder::new("PharmaGovFlow::Platform::Action::view")
        .build();

    let action_create = ActionBuilder::new("PharmaGovFlow::Platform::Action::create")
        .build();

    // Create a new Context
    let context = ContextBuilder::new()
        .with_property("time", serde_json::json!("2025-01-23T16:17:46+00:00"))
        .build();

    // Create evaluations
    let evaluation_view = EvaluationBuilder::new(Some(subject.clone()), Some(resource.clone()), Some(action_view.clone()))
        .with_request_id("134")
        .build();

    let evaluation_create = EvaluationBuilder::new(Some(subject.clone()), Some(resource.clone()), Some(action_create.clone()))
        .with_request_id("435")
        .build();

    // Create the entities
    let mut entity = HashMap::new();
    entity.insert(
        "uid".to_string(),
        serde_json::json!({
            "type": "PharmaGovFlow::Platform::Branch",
            "id": "fb008a600df04b21841c4fb5ad27ddf7"
        }),
    );
    entity.insert(
        "attrs".to_string(),
        serde_json::json!({
            "status": "active"
        }),
    );
    entity.insert("parents".to_string(), serde_json::json!([]));

    let entities = vec![Some(entity)];

    // Create a new authorization request
    let request = AzRequestBuilder::new(836576733282, "9c08015ca0fe46e9b0b54179cbd22bf3")
        .with_request_id(Some("7567".to_string()))
        .with_subject(Some(subject))
        .with_principal(Some(principal))
        .with_entities_map("cedar", entities)
        .with_context(Some(context))
        .with_evaluation(evaluation_view)
        .with_evaluation(evaluation_create)
        .build();

    match client.check_auth(Some(request)).await {
        Ok(response) => {
            if response.decision {
                println!("✅ Authorization Permitted");
            } else {
                println!("❌ Authorization Denied");
                if let Some(ctx) = response.context {
                    if let Some(admin) = ctx.reason_admin {
                        println!("-> Reason Admin: {}", admin.message);
                    }
                    if let Some(user) = ctx.reason_user {
                        println!("-> Reason User: {}", user.message);
                    }
                }

                for eval in response.evaluations {
                    if eval.decision {
                        println!("-> ✅ Authorization Permitted");
                    }
                    if let Some(ctx) = eval.context {
                        if let Some(admin) = ctx.reason_admin {
                            println!("-> Reason Admin: {}", admin.message);
                        }
                        if let Some(user) = ctx.reason_user {
                            println!("-> Reason User: {}", user.message);
                        }
                    }
                }
            }
        }
        Err(e) => {
            eprintln!("❌ Failed to check auth: {}", e);
            return Err(Err(e.into()));
        }
    }
```
