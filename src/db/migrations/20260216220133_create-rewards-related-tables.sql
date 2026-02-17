-- migrate:up
CREATE TABLE rewards (
  id UUID PRIMARY KEY,
  partner_id INT NOT NULL REFERENCES partners(id) ON DELETE RESTRICT,
  redemption_forums redemption_forum[] NOT NULL,
  voucher_type voucher_type NOT NULL,
  available_from_exact TIMESTAMPTZ,
  available_until_exact TIMESTAMPTZ,
  available_from_local TIMESTAMP,
  available_until_local TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER rewards_update_trigger
BEFORE UPDATE ON rewards
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE reward_categories (
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(reward_id, category_id)
);

CREATE TRIGGER reward_categories_update_trigger
BEFORE UPDATE ON reward_categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE reward_details_translations (
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES languages(language_code) ON DELETE RESTRICT,
  short_description TEXT NOT NULL,
  long_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER reward_details_translations_update_trigger
BEFORE UPDATE ON reward_details_translations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE reward_details_translations;
DROP TABLE reward_categories;
DROP TABLE rewards;
