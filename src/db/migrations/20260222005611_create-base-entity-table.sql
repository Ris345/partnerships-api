-- migrate:up
CREATE TABLE base_entity (
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER disallow_insert_into_base_entity
BEFORE INSERT ON base_entity
FOR EACH ROW EXECUTE FUNCTION disallow_insert();

-- migrate:down
DROP TABLE base_entity;