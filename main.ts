import "https://deno.land/std@0.215.0/dotenv/load.ts";
import Logger from "https://deno.land/x/logger@v1.1.5/logger.ts";
import { Hono, Context } from "https://deno.land/x/hono@v4.0.0/mod.ts";
import {
  bearerAuth,
  prettyJSON,
  logger as honoLogger,
} from "https://deno.land/x/hono@v4.0.0/middleware.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { createClient } from "npm:@libsql/client";
import { strSlicer } from "./utils.ts";

const logger = new Logger();

const SST = Deno.env.get("SST") || nanoid(); // generate a random token for safety

const TURSO_API_URL = Deno.env.get("TURSO_API_URL") || "http://localhost:3000";
const TURSO_API_TOKEN = Deno.env.get("TURSO_API_TOKEN") || "secret";

if (Deno.env.get("DENO_ENV") === "development") {
  logger.info("SST", SST);
  logger.info("TURSO_API_URL", TURSO_API_URL);
  logger.info("TURSO_API_TOKEN", strSlicer(TURSO_API_TOKEN));
}

const app = new Hono();

const client = createClient({
  url: TURSO_API_URL,
  authToken: TURSO_API_TOKEN,
});

app.use(honoLogger());
app.use(prettyJSON());

app.get("/", (c: Context) => {
  const uuid = crypto.randomUUID();
  const ts = new Date().getTime();
  return c.json({
    id: uuid,
    ts,
    message: "up and running!",
  });
});

app.post("/", bearerAuth({ token: SST }), async (c: Context) => {
  const uuid = crypto.randomUUID();
  const ts = new Date().getTime();
  const json = await c.req.json();
  const { severity, category, body } = json;
  const result = await client.execute({
    sql: `
      INSERT INTO events (
        uuid, ts, severity, category, body,
        customer_external_id, customer_phone, customer_email,
        thread_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id, uuid, ts, severity, category`,
    args: [uuid, ts, severity, category, body, null, null, null, null],
  });
  const { rows = [] } = result;
  const inserted = rows[0] || {};
  return c.json({
    ...inserted,
  });
});

Deno.serve(app.fetch);
