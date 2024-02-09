import "https://deno.land/std@0.215.0/dotenv/load.ts";
import { Hono, Context } from "https://deno.land/x/hono@v4.0.0/mod.ts";
import {
  bearerAuth,
  prettyJSON,
  logger,
} from "https://deno.land/x/hono@v4.0.0/middleware.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

const SST = Deno.env.get("SST") || nanoid(); // generate a random token for safety

const app = new Hono();

app.use(logger());
app.use(prettyJSON());

app.get("/", (c: Context) => {
  const uuid = crypto.randomUUID();
  const now = new Date().toISOString();
  return c.json({
    id: uuid,
    now,
    message: "up and running!",
  });
});

app.post("/", bearerAuth({ token: SST }), (c: Context) => {
  const uuid = crypto.randomUUID();
  const now = new Date().toISOString();
  return c.json({
    id: uuid,
    now,
    message: "send me some events!",
  });
  // const { username, password } = c.body;
  // if (username === "admin" && password === "admin") {
  //   return c.json({ token: SST });
  // }
  // return c.status(401).json({ message: "Unauthorized" });
});

Deno.serve(app.fetch);
