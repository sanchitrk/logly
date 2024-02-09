import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req) {
    const uuid = crypto.randomUUID();
    const ts = new Date().toISOString();
    const response = {
      id: uuid,
      ts,
      message: "zyg eventer up and running!",
    };
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
