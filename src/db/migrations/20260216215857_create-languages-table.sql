-- migrate:up
CREATE TABLE languages (
  language_code CHAR(2) PRIMARY KEY,
  language_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER languages_update_trigger
BEFORE UPDATE ON languages
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE languages;