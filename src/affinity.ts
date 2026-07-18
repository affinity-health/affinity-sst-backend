import { Affinity } from "@affinity-health/sdk";

const apiKey = process.env.AFFINITY_API_KEY?.trim();
if (!apiKey) throw new Error("AFFINITY_API_KEY is required");
if (!apiKey.startsWith("sk_test_")) {
  throw new Error("This local tester only accepts an Affinity test-mode key");
}
const baseUrl = process.env.AFFINITY_API_BASE_URL ?? "https://api-staging.joinaffinityai.com";

export const affinity = new Affinity(apiKey, {
  apiVersion: "2026-07-09",
  baseUrl,
});
