import { describe, expect, test } from "bun:test";

import { handleRequest } from "../src/app";

describe("Affinity SDK tester", () => {
  test("publishes its OpenAPI routes", async () => {
    const response = await handleRequest(new Request("http://localhost:3000/spec.json"));
    const document = (await response.json()) as { paths: Record<string, unknown> };

    expect(response.status).toBe(200);
    expect(Object.keys(document.paths).sort()).toEqual([
      "/access",
      "/catalog",
      "/orders",
      "/orders/{orderId}",
      "/practices",
    ]);
  });

  test("validates query limits before calling Affinity", async () => {
    const response = await handleRequest(new Request("http://localhost:3000/catalog?limit=0"));
    expect(response.status).toBe(400);
  });
});
