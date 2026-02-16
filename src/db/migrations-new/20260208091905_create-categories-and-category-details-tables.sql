-- migrate:up
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
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

CREATE TABLE category_translations (
  language_code_id INT NOT NULL REFERENCES language_codes(id) ON DELETE RESTRICT,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  PRIMARY KEY(language_code_id, category_id)
);

COMMENT ON TABLE category_translations IS '@introspeql-include';

CREATE TRIGGER category_translations_update_trigger
BEFORE UPDATE ON category_translations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE category_translations;
DROP TABLE categories;
