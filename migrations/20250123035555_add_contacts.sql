-- Add migration script here
--Create Contacts Table
CREATE TABLE IF NOT EXISTS contacts(
    id uuid NOT NULL,
    PRIMARY KEY (id),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    message TEXT,
    contact_time timestamptz NOT NULL
)