import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

import { router } from "./router";

const handler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      docsTitle: "Affinity SDK Tester",
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          description: "A tiny local API for exercising the Affinity TypeScript SDK.",
          title: "Affinity SDK Tester",
          version: "0.1.0",
        },
        servers: [{ url: "http://localhost:3000" }],
      },
    }),
  ],
});

export async function handleRequest(request: Request) {
  const result = await handler.handle(request, { context: {} });
  return result.matched ? result.response : new Response("Not Found", { status: 404 });
}
