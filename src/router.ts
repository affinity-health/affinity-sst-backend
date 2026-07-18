import { os } from "@orpc/server";
import * as z from "zod";

import { affinity } from "./affinity";

const sdkOutput = z.unknown();
const idempotencyKey = z.string().trim().min(1).max(255);
const address = z.object({
  city: z.string().trim().min(1),
  country: z.string().trim().length(2).default("US"),
  line1: z.string().trim().min(1),
  line2: z.string().trim().min(1).optional(),
  postalCode: z.string().trim().min(1),
  state: z.string().trim().length(2),
});

const access = os
  .route({
    method: "GET",
    path: "/access",
    summary: "Inspect the configured API key and sandbox mode",
    tags: ["Affinity"],
  })
  .output(sdkOutput)
  .handler(() => affinity.account.retrieveAccess());

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
  .handler(({ input }) => affinity.catalog.list(input));

const practices = os
  .route({
    method: "GET",
    path: "/practices",
    summary: "List practices available to the platform",
    tags: ["Affinity"],
  })
  .input(z.object({ limit: z.coerce.number().int().min(1).max(100).default(25) }))
  .output(sdkOutput)
  .handler(({ input }) => affinity.practices.list(input));

const practiceCreate = os
  .route({
    method: "POST",
    path: "/practices",
    summary: "Create a test practice",
    tags: ["Affinity"],
  })
  .input(
    z.object({
      address,
      attestations: z.object({
        authorizedPhiTransfer: z.literal(true),
        authorizedPracticeRelationship: z.literal(true),
        minimumNecessaryPhi: z.literal(true),
        providerDataAccuracy: z.literal(true),
      }),
      externalId: z.string().trim().min(1).max(160),
      idempotencyKey,
      name: z.string().trim().min(1).max(200),
      primaryContact: z.object({
        email: z.email(),
        name: z.string().trim().min(1),
      }),
    }),
  )
  .output(sdkOutput)
  .handler(({ input }) => {
    const { idempotencyKey, ...practice } = input;
    return affinity.practices.create(practice, { idempotencyKey });
  });

const orders = os
  .route({
    method: "GET",
    path: "/orders",
    summary: "List platform orders",
    tags: ["Affinity"],
  })
  .input(
    z.object({
      limit: z.coerce.number().int().min(1).max(250).default(25),
      practiceId: z.uuid().optional(),
    }),
  )
  .output(sdkOutput)
  .handler(({ input }) => affinity.orders.list(input));

const orderCreate = os
  .route({
    method: "POST",
    path: "/orders",
    summary: "Create a test order",
    tags: ["Affinity"],
  })
  .input(
    z.object({
      catalogItemId: z.string().trim().min(1),
      directions: z.string().trim().min(1),
      externalOrderId: z.string().trim().min(1).max(120),
      idempotencyKey,
      patient: z.object({
        address,
        dateOfBirth: z.coerce.date(),
        email: z.email(),
        externalPatientId: z.string().trim().min(1).max(120),
        name: z.string().trim().min(1),
        state: z.string().trim().length(2),
      }),
      practiceId: z.uuid(),
      prescriber: z.object({
        licenseStates: z.array(z.string().trim().length(2)).min(1),
        name: z.string().trim().min(1),
        npi: z.string().regex(/^\d{10}$/),
      }),
      prescription: z.object({
        authorized: z.literal(true),
        signedAt: z.coerce.date(),
      }),
      quantity: z.coerce.number().int().min(1),
    }),
  )
  .output(sdkOutput)
  .handler(({ input }) => {
    const { idempotencyKey, ...order } = input;
    return affinity.orders.create(order, { idempotencyKey });
  });

const order = os
  .route({
    method: "GET",
    path: "/orders/{orderId}",
    summary: "Retrieve one platform order",
    tags: ["Affinity"],
  })
  .input(z.object({ orderId: z.string().trim().min(1) }))
  .output(sdkOutput)
  .handler(({ input }) => affinity.orders.retrieve(input.orderId));

const orderSubmit = os
  .route({
    method: "POST",
    path: "/orders/{orderId}/submit",
    summary: "Submit a test order",
    tags: ["Affinity"],
  })
  .input(z.object({ idempotencyKey, orderId: z.string().trim().min(1) }))
  .output(sdkOutput)
  .handler(({ input }) =>
    affinity.orders.submit(input.orderId, { idempotencyKey: input.idempotencyKey }),
  );

export const router = {
  access,
  catalog,
  order,
  orderCreate,
  orders,
  orderSubmit,
  practiceCreate,
  practices,
};
