-- migrate:up
CREATE TABLE base_entity (
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT disallow_insert CHECK (false) NO INHERIT
);

-- migrate:down
DROP TABLE base_entity;