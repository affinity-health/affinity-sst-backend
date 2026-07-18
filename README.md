# Affinity TypeScript Backend Tester

A deliberately tiny local oRPC + OpenAPI server for exercising the Affinity TypeScript SDK against
the staging API. It is not an application backend, an authentication example, or a production
proxy.

## Setup

The SDK is currently linked from the local `affinity-typescript` checkout rather than installed
from npm:

```sh
cd ../affinity-typescript
bun install
bun run build
bun link

cd ../affinity-sst-backend
bun install
bun link @affinity-health/sdk
cp .env.example .env
bun run dev
```

Set `AFFINITY_API_KEY` in `.env` to an `sk_test_...` key. The local `.env` is ignored by Git.
By default, the tester calls `https://api-staging.joinaffinityai.com`.

## Routes

```text
GET /                                  Open the Scalar API reference
GET /spec.json                         Read the generated OpenAPI document
GET /access                            Inspect the current key and sandbox mode
GET /catalog?query=semaglutide&limit=10
GET /practices?limit=25
GET /orders?limit=25
GET /orders/:orderId
```

Try it with:

```sh
curl http://localhost:3000/access
curl "http://localhost:3000/catalog?query=semaglutide&limit=5"
```

The server refuses to start with a live key. The SDK setup uses only the key, pinned API version,
and staging base URL; it does not override `fetch`.

## Checks

```sh
bun run check
bun run build
```

SST infrastructure is intentionally deferred. If this tester becomes a real starter application,
SST, API Gateway, caller authentication, secret storage, and production operational controls can
be added then.
