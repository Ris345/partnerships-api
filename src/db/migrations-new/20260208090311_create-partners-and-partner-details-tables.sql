-- migrate:up
CREATE TABLE partners (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE partners IS $$
Businesses that have partnered with 8by8 to offer rewards to users of 
8by8 applications.

@introspeql-include
$$;

CREATE TRIGGER partners_update_trigger 
BEFORE UPDATE ON partners 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE partner_details (
  language_code_id INT NOT NULL REFERENCES language_codes(id) ON DELETE RESTRICT,
  partner_id INT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  partner_logo_url TEXT NOT NULL,
  partner_description TEXT NOT NULL,
  partner_website_url TEXT,
  partner_website_link_text TEXT,
  partner_reason_for_supporting_8by8 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (language_code_id, partner_id)
);

COMMENT ON TABLE partner_details IS $$
Details about partners of 8by8, provided in a variety of languages.

@introspeql-include
$$;

CREATE TRIGGER partner_details_update_trigger 
BEFORE UPDATE ON partner_details
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE partner_details;
DROP TABLE partners;