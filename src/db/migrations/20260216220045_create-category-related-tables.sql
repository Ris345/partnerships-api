-- migrate:up
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER categories_update_trigger
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE category_translations (
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES languages(language_code) ON DELETE RESTRICT,
  category_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER category_translations_update_trigger
BEFORE UPDATE ON category_translations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE category_translations;
DROP TABLE categories;
