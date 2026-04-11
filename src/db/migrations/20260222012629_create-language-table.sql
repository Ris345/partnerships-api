-- migrate:up
CREATE TABLE language (
  language_code CHAR(2) PRIMARY KEY,
  language_name_en VARCHAR(255) NOT NULL,
  language_name_native VARCHAR(255) NOT NULL
  CONSTRAINT language_code_must_be_uppercase CHECK (
    language_code = UPPER(language_code)
  )
) INHERITS (base_entity);

COMMENT ON TABLE language IS '@introspeql-include';

COMMENT ON COLUMN language.language_name_en
IS 'The name of the language in English.';

COMMENT ON COLUMN language.language_name_native 
IS 'The native name of the language.';

CREATE TRIGGER language_update_trigger
BEFORE UPDATE ON language
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE language;