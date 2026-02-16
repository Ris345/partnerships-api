-- migrate:up
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE categories IS $$
Unique categories that can describe rewards.

@introspeql-include
$$;

CREATE TRIGGER categories_update_trigger
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE categories;
