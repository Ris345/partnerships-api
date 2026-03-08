-- migrate:up
CREATE TABLE language (
  language_code CHAR(2) PRIMARY KEY,
  language_name VARCHAR(50) NOT NULL,
  CONSTRAINT language_code_must_be_uppercase CHECK (
    language_code = UPPER(language_code)
  )
) INHERITS (base_entity);

COMMENT ON TABLE language IS '@introspeql-include';

CREATE TRIGGER language_update_trigger
BEFORE UPDATE ON language
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE language;