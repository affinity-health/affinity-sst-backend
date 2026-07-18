import { Affinity } from "@affinity-health/sdk";
import { z } from "zod";

const env = z.object({
  AFFINITY_API_KEY: z.string().trim().startsWith("sk_test_", "AFFINITY_API_KEY must start with 'sk_test_'"),
  AFFINITY_API_BASE_URL: z.url().default("https://api.joinaffinityai.com"),
}).parse(process.env);

export const affinity = new Affinity(env.AFFINITY_API_KEY, {
  apiVersion: "2026-07-09",
  baseUrl: env.AFFINITY_API_BASE_URL,
});
