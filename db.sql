-- Note: we can have multiple database per workspace, where `account`
-- represents each workspace and all the child tables are related to `account` aka `workspace`

-- In Zyg `id` will be workspace_slug` but its optional not mandatory
-- `account` is 1:1 with `workspace` in Zyg
-- Will be using superkey to manage the account from Zyg.
-- keeping the `id` value same as `workspace_slug` for easy reference
CREATE TABLE account (
    id TEXT PRIMARY KEY,
    ts TIMESTAMP NOT NULL,
    name TEXT NOT NULL
);

-- `token` is used to authenticate the account in client sdk.
-- from `secret` we can identify the `account_id`
-- Has 1:M relationship with `account` where `account` is 1 and `token` is M
CREATE TABLE token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE, -- unique identifier for token
    name TEXT NOT NULL, -- name of the token
    account_id TEXT NOT NULL, -- account id
    secret TEXT NOT NULL UNIQUE, -- auto generated secret by application
    ts TIMESTAMP NOT NULL, -- timestamp of creation
    FOREIGN KEY (account_id) REFERENCES account(id) -- foreign key to account
);

CREATE TABLE event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE, -- unique identifier for event
    account_id TEXT NOT NULL, -- account id
    ts TIMESTAMP NOT NULL, -- timestamp of creation
    severity TEXT NOT NULL, -- severity of event like "info", "warning", "error"
    category TEXT NOT NULL, -- category of event like "order", "payment", "customer"
    body TEXT NOT NULL, -- markdown body of event
    customer_external_id TEXT, -- [Optional] identifier for customer external id
    customer_phone TEXT, -- [Optional] identifier for customer phone
    customer_email TEXT, -- [Optional] identifier for customer email
    thread_id TEXT, -- [Optional] linked to thread id
    FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE webhook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL, -- account id
    name TEXT NOT NULL, -- name of the webhook
    url TEXT NOT NULL, -- url of the webhook
    ts TIMESTAMP NOT NULL, -- timestamp of creation
    header TEXT, -- [Optional] template header of webhook
    body TEXT NOT NULL, -- template body of webhook
    UNIQUE (account_id, name), -- unique constraint on account_id and name
    FOREIGN KEY (account_id) REFERENCES account(id)
);

-- This script creates a table named "event_outbox" to store outgoing events.
-- The table has the following columns:
--   - id: An auto-incrementing integer that serves as the primary key.
--   - event_id: An integer that represents the ID of the event.
--   - status: A text field that indicates the status of the event, such as "dispatched", "success", or "failed".
--   - ts: A timestamp field that stores the dispatched timestamp of the event.
--   - ack: A boolean field that indicates whether the event has been acknowledged by the server. It has a default value of FALSE.
-- The table also has a foreign key constraint that references the "event" table.
CREATE TABLE event_outbox (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    ts TIMESTAMP NOT NULL,
    ack BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES event(id)
);