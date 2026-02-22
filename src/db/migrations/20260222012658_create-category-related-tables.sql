-- migrate:up
CREATE TABLE category (
  id SERIAL PRIMARY KEY
) INHERITS (base_entity);

CREATE TRIGGER category_update_trigger
BEFORE UPDATE ON category
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE category_translation (
  category_id INT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  language_code CHAR(2) NOT NULL REFERENCES language(language_code) ON DELETE RESTRICT,
  category_name TEXT NOT NULL,
  PRIMARY KEY(category_id, language_code)
) INHERITS (base_entity);

CREATE TRIGGER category_translation_update_trigger
BEFORE UPDATE ON category_translation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE category_translation;
DROP TABLE category;
