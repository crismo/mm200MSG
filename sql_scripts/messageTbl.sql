-- DDL generated by Postico 1.5.19
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE msg (
    id SERIAL PRIMARY KEY,
    msg text
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX msg_pkey ON msg(id int4_ops);
