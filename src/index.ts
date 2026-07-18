import { handleRequest } from "./app";

const port = Number(process.env.PORT ?? 3000);

Bun.serve({ fetch: handleRequest, port });
console.log(`Affinity SDK tester: http://localhost:${port}`);
