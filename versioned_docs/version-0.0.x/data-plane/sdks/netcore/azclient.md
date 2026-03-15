---
id: azclient
title: AuthZClient
sidebar_label: AuthZClient
sidebar_position: 2
description: This section provides instructions for using the AuthZClient in the .NET Core SDK.
---

The application, acting as a Policy Enforcement Point (PEP), enforces policies defined by the Policy Decision Point (PDP). The Permguard .NET Core SDK facilitates communication with the Permguard PDP.

This communication occurs through the `AuthZClient`, a component that provides a straightforward interface for interacting with the Permguard `Server`.

## The Basic Structure of an Authorization Request

A standard authorization request is composed of the following key elements:

```csharp
try
{
    // Create a new Permguard client
    var client = new AzClient(new AzConfig().WithEndpoint(new AzEndpoint("http", 9094, "localhost")));

    // Load the json file
    var filePath = Path.Combine(AppContext.BaseDirectory, "../../../ok_onlyone1.json");
    if (!File.Exists(filePath))
    {
        Console.WriteLine("❌ Failed to load the json file");
        throw new Exception("Failed to load the json file");
    }
    var jsonContent = File.ReadAllText(filePath);
    var request = JsonSerializer.Deserialize<AzRequest>(jsonContent);

    // Check the authorization
    var response = client.CheckAuth(request);
    if (response == null)
    {
        Console.WriteLine("❌ Failed to check auth.");
        throw new Exception("Failed to check auth response");
    }
    if (response.Decision) {
        Console.WriteLine("✅ Authorization Permitted");
    }
    else
    {
        Console.WriteLine("❌ Authorization Denied");
        if (response.Context != null) {
            if (response.Context?.ReasonAdmin != null)
            {
                Console.WriteLine($"-> Reason Admin: {response.Context?.ReasonAdmin?.Message}");
            }
            if (response.Context?.ReasonUser != null)
            {
                Console.WriteLine($"-> Reason User: {response.Context?.ReasonUser?.Message}");
            }
        }
        foreach (var eval in response.Evaluations)
        {
            if (eval.Decision)
            {
                Console.WriteLine("-> ✅ Authorization Permitted");
            }
            if (eval.Context != null) {
                if (eval.Context?.ReasonAdmin != null)
                {
                    Console.WriteLine($"-> Reason Admin: {eval.Context?.ReasonAdmin?.Message}");
                }
                if (eval.Context?.ReasonUser != null)
                {
                    Console.WriteLine($"-> Reason User: {eval.Context?.ReasonUser?.Message}");
                }
            }
        }
    }
}
catch (Exception e)
{
    Console.WriteLine("❌ Failed to check auth.");
    throw;
}
```

## Perform an Atomic Authorization Request

An `atomic authorization` request can be performed using the `AuthZClient` by creating a new client instance and invoking the `Check` method.

```csharp
try
{
    // Create a new Permguard client
    var client = new AzClient(new AzConfig().WithEndpoint(new AzEndpoint("http", 9094, "localhost")));

    // Create the Principal
    var principal = new PrincipalBuilder("amy.smith@pharmago.com")
        .WithSource("keycloak")
        .WithType("user")
        .Build();

    // Create the entities
    var entities = new List<Dictionary<string, object>?>
    {
        new()
        {
            { "uid", new Dictionary<string,object>
                {
                    { "type", "PharmaGovFlow::Platform::Branch" },
                    { "id", "fb008a600df04b21841c4fb5ad27ddf7" }
                }
            },
            { "attrs", new Dictionary<string, object> { { "status", "active" } } },
            { "parents", new List<object>() }
        }
    };

    // Create a new authorization request
    var request = new AzAtomicRequestBuilder(836576733282,
            "9c08015ca0fe46e9b0b54179cbd22bf3",
            "amy.smith@pharmago.com",
            "PharmaGovFlow::Platform::Branch",
            "PharmaGovFlow::Platform::Action::create")
        // RequestID
        .WithRequestId("31243")
        // Principal
        .WithPrincipal(principal)
        // Entities
        .WithEntitiesMap("cedar", entities)
        // Subject
        .WithSubjectType("user")
        // Resource
        .WithResourceId("fb008a600df04b21841c4fb5ad27ddf7")
        .WithResourceProperty("status", "active")
        // Context
        .WithContextProperty("time", "2025-01-23T16:17:46+00:00")
        .Build();

    // Check the authorization
    var response = client.CheckAuth(request);
    if (response == null)
    {
        Console.WriteLine("❌ Failed to check auth.");
        throw new Exception("Failed to check auth response");
    }
    if (response.Decision) {
        Console.WriteLine("✅ Authorization Permitted");
    }
    else
    {
        Console.WriteLine("❌ Authorization Denied");
        if (response.Context != null) {
            if (response.Context?.ReasonAdmin != null)
            {
                Console.WriteLine($"-> Reason Admin: {response.Context?.ReasonAdmin?.Message}");
            }
            if (response.Context?.ReasonUser != null)
            {
                Console.WriteLine($"-> Reason User: {response.Context?.ReasonUser?.Message}");
            }
        }
        foreach (var eval in response.Evaluations)
        {
            if (eval.Decision)
            {
                Console.WriteLine("-> ✅ Authorization Permitted");
            }
            if (eval.Context != null) {
                if (eval.Context?.ReasonAdmin != null)
                {
                    Console.WriteLine($"-> Reason Admin: {eval.Context?.ReasonAdmin?.Message}");
                }
                if (eval.Context?.ReasonUser != null)
                {
                    Console.WriteLine($"-> Reason User: {eval.Context?.ReasonUser?.Message}");
                }
            }
        }
    }
}
catch (Exception e)
{
    Console.WriteLine("❌ Failed to check auth.");
    throw;
}
```

## Perform a Composed Authorization Request

To perform a composed authorization request using the `AuthZClient`, you need to create a new client and call the `Check` method.

:::note
This type of request is designed for scenarios requiring greater control over the authorization request creation, as well as cases where multiple evaluations must be executed within a single request.
:::

```csharp
try
{
    // Create a new Permguard client
    var client = new AzClient(new AzConfig().WithEndpoint(new AzEndpoint("http", 9094, "localhost")));

    // Create the Principal
    var principal = new PrincipalBuilder("amy.smith@pharmago.com")
        .WithSource("keycloak")
        .WithType("user").Build();

    // Create a new subject
    var subject = new SubjectBuilder("amy.smith@pharmago.com")
        .WithType("user")
        .Build();

    // Create a new resource
    var resource = new ResourceBuilder("PharmaGovFlow::Platform::Branch")
        .WithId("fb008a600df04b21841c4fb5ad27ddf7")
        .WithProperty("status", "active")
        .Build();

    // Create actions
    var actionView = new ActionBuilder("PharmaGovFlow::Platform::Action::view")
        .Build();

    var actionCreate = new ActionBuilder("PharmaGovFlow::Platform::Action::create")
        .Build();

    // Create a new Context
    var context = new ContextBuilder()
        .WithProperty("time", "2025-01-23T16:17:46+00:00")
        .Build();

    // Create evaluations
    var evaluationView = new EvaluationBuilder(subject, resource, actionView)
        .WithRequestId("134")
        .Build();

    var evaluationCreate = new EvaluationBuilder(subject, resource, actionCreate)
        .WithRequestId("435")
        .Build();

    // Create the entities
    var entities = new List<Dictionary<string, object>?>
    {
        new()
        {
            { "uid", new Dictionary<string,object>
                {
                    { "type", "PharmaGovFlow::Platform::Branch" },
                    { "id", "fb008a600df04b21841c4fb5ad27ddf7" }
                }
            },
            { "attrs", new Dictionary<string, object> { { "status", "active" } } },
            { "parents", new List<object>() }
        }
    };

    // Create a new authorization request
    var request = new AzRequestBuilder(836576733282, "9c08015ca0fe46e9b0b54179cbd22bf3")
        .WithRequestId("123457")
        .WithSubject(subject)
        .WithPrincipal(principal)
        .WithEntitiesMap("cedar", entities)
        .WithContext(context)
        .WithEvaluation(evaluationView)
        .WithEvaluation(evaluationCreate)
        .Build();

    // Check the authorization
    var response = client.CheckAuth(request);
    if (response == null)
    {
        Console.WriteLine("❌ Failed to check auth.");
        throw new Exception("Failed to check auth response");
    }
    if (response.Decision) {
        Console.WriteLine("✅ Authorization Permitted");
    }
    else
    {
        Console.WriteLine("❌ Authorization Denied");
        if (response.Context != null) {
            if (response.Context?.ReasonAdmin != null)
            {
                Console.WriteLine($"-> Reason Admin: {response.Context?.ReasonAdmin?.Message}");
            }
            if (response.Context?.ReasonUser != null)
            {
                Console.WriteLine($"-> Reason User: {response.Context?.ReasonUser?.Message}");
            }
        }
        foreach (var eval in response.Evaluations)
        {
            if (eval.Decision)
            {
                Console.WriteLine("-> ✅ Authorization Permitted");
            }
            if (eval.Context != null) {
                if (eval.Context?.ReasonAdmin != null)
                {
                    Console.WriteLine($"-> Reason Admin: {eval.Context?.ReasonAdmin?.Message}");
                }
                if (eval.Context?.ReasonUser != null)
                {
                    Console.WriteLine($"-> Reason User: {eval.Context?.ReasonUser?.Message}");
                }
            }
        }
    }
}
catch (Exception e)
{
    Console.WriteLine("❌ Failed to check auth.");
    throw;
}
```
