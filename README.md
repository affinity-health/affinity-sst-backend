# Affinity SST Backend

A minimal TypeScript backend that wraps the Affinity API and deploys to AWS with SST.

> **Status:** This is a design scaffold. No application or infrastructure code has been added yet.

The finished starter will show the smallest responsible way to place an application-specific API
in front of Affinity. It will keep the Affinity API key on the server, authenticate callers, and
expose a few narrow routes using the official [`@affinity-health/sdk`](https://github.com/affinity-health/affinity-typescript).

## Intended architecture

```text
Your web or mobile app
          |
          | application authentication
          v
Amazon API Gateway
          |
          v
AWS Lambda + Hono + @affinity-health/sdk
          |
          | Affinity service API key
          v
Affinity API
```

SST will define and deploy the API Gateway and Lambda resources. The application will use Hono for
a small TypeScript HTTP layer and the Affinity TypeScript SDK for upstream requests.

## Planned routes

The first version will intentionally stay small:

- `GET /catalog` — perform a server-side catalog search
- `GET /practices` — list practices available to the integration
- `GET /orders/:orderId` — retrieve one order for the authenticated application user

The wrapper will return only the fields its application needs. It will not act as an unauthenticated
proxy for arbitrary Affinity endpoints.

## Planned configuration

```text
AFFINITY_API_KEY       Affinity test service key stored as an SST secret
AFFINITY_API_VERSION   Dated API version pinned by the backend
```

The repository will default to Affinity test mode and contain no real patient or prescription
fixtures.

## Why AWS

AWS Lambda and API Gateway provide a straightforward serverless deployment path and are currently
listed by AWS as HIPAA-eligible services. Eligibility alone does not make a deployment compliant.
Any integrator handling protected health information must establish the required agreements and
configure authentication, encryption, logging, retention, access controls, and incident response
for their own environment.

## Deliberately out of scope

The initial starter will not include:

- A frontend
- A database or ORM
- User-management screens
- Queues or background workers
- Production patient fixtures
- A claim that deploying the repository makes an application HIPAA compliant

Those choices belong to the integrating application. This repository is only the boundary between
an authenticated custom backend and the Affinity API.

## Related projects

- [Affinity TypeScript SDK](https://github.com/affinity-health/affinity-typescript)
- [Affinity OpenAPI specification](https://github.com/affinity-health/affinity-openapi)
