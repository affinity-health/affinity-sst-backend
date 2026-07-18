import { ResponseError } from "@affinity-health/sdk";
import { ORPCError, os } from "@orpc/server";
import * as z from "zod";

import { affinity } from "./affinity";

const sdkOutput = z.unknown();

const access = os
  .route({
    method: "GET",
    path: "/access",
    summary: "Inspect the configured API key and sandbox mode",
    tags: ["Affinity"],
  })
  .output(sdkOutput)
  .handler(() => upstream(() => affinity.account.retrieveAccess()));

const catalog = os
  .route({
    method: "GET",
    path: "/catalog",
    summary: "Search the medication catalog",
    tags: ["Affinity"],
  })
  .input(
    z.object({
      limit: z.coerce.number().int().min(1).max(250).default(10),
      query: z.string().trim().min(1).optional(),
    }),
  )
  .output(sdkOutput)
  .handler(({ input }) => upstream(() => affinity.catalog.list(input)));

const practices = os
  .route({
    method: "GET",
    path: "/practices",
    summary: "List practices available to the platform",
    tags: ["Affinity"],
  })
  .input(z.object({ limit: z.coerce.number().int().min(1).max(100).default(25) }))
  .output(sdkOutput)
  .handler(({ input }) => upstream(() => affinity.practices.list(input)));

const orders = os
  .route({
    method: "GET",
    path: "/orders",
    summary: "List platform orders",
    tags: ["Affinity"],
  })
  .input(z.object({ limit: z.coerce.number().int().min(1).max(250).default(25) }))
  .output(sdkOutput)
  .handler(({ input }) => upstream(() => affinity.orders.list(input)));

const order = os
  .route({
    method: "GET",
    path: "/orders/{orderId}",
    summary: "Retrieve one platform order",
    tags: ["Affinity"],
  })
  .input(z.object({ orderId: z.string().trim().min(1) }))
  .output(sdkOutput)
  .handler(({ input }) => upstream(() => affinity.orders.retrieve(input.orderId)));

export const router = { access, catalog, order, orders, practices };

async function upstream<T>(request: () => Promise<T>) {
  try {
    return await request();
  } catch (error) {
    if (error instanceof ResponseError) {
      const detail = await error.response.json().catch(() => null);
      throw new ORPCError("BAD_GATEWAY", {
        cause: error,
        data: { detail, upstreamStatus: error.response.status },
        message: "Affinity API request failed",
      });
    }
    throw error;
  }
}
