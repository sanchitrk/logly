CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    ts TIMESTAMP NOT NULL,
    severity TEXT NOT NULL,
    category TEXT NOT NULL,
    body TEXT NOT NULL,
    customer_external_id TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    thread_id TEXT
);
