-- migrate:up
CREATE TABLE partners (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER partners_update_trigger 
BEFORE UPDATE ON partners 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE partner_details_translations (
  partner_id INT REFERENCES partners(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES languages(language_code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  web_address_url TEXT,
  web_address_text TEXT,
  reason_for_supporting_8by8 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(partner_id, language_code)
);

CREATE TRIGGER partners_details_translations_update_trigger 
BEFORE UPDATE ON partner_details_translations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE partner_details_translations;
DROP TABLE partners;


