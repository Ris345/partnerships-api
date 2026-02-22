-- migrate:up
CREATE TABLE partner (
  id SERIAL PRIMARY KEY
) INHERITS (base_entity);

CREATE TRIGGER partner_update_trigger 
BEFORE UPDATE ON partner
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE partner_details_translation (
  partner_id INT REFERENCES partner(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES language(language_code) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  web_address_url TEXT,
  web_address_text TEXT,
  reason_for_supporting_8by8 TEXT,
  PRIMARY KEY(partner_id, language_code)
) INHERITS (base_entity);

CREATE TRIGGER partners_details_translation_update_trigger 
BEFORE UPDATE ON partner_details_translation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE partner_details_translation;
DROP TABLE partner;


