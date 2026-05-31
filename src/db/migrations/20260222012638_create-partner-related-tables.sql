-- migrate:up
CREATE TABLE partner (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
) INHERITS (base_entity);

COMMENT ON TABLE partner IS '@introspeql-include';

CREATE TRIGGER partner_update_trigger 
BEFORE UPDATE ON partner
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE partner_details_translation (
  partner_id INT REFERENCES partner(id) ON DELETE CASCADE,
  language_tag TEXT REFERENCES language(language_tag) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  web_address_url TEXT,
  web_address_text TEXT,
  motivation TEXT,
  PRIMARY KEY(partner_id, language_tag)
) INHERITS (base_entity);

COMMENT ON TABLE partner_details_translation IS '@introspeql-include';

CREATE TRIGGER partners_details_translation_update_trigger 
BEFORE UPDATE ON partner_details_translation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE partner_details_translation;
DROP TABLE partner;


