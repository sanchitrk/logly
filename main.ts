import { Hono, Context } from "https://deno.land/x/hono@v4.0.0/mod.ts";
import { logger } from "https://deno.land/x/hono@v4.0.0/middleware.ts";

const app = new Hono();

app.use(logger());

app.get("/", (c: Context) => {
  return c.text("Hello Hono!");
});

Deno.serve(app.fetch);
