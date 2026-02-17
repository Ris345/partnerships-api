-- migrate:up
CREATE TABLE vouchers (
  id BIGSERIAL PRIMARY KEY
);

CREATE FUNCTION reward_voucher_type_matches(
  reward_id UUID, 
  expected_voucher_type voucher_type
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT rewards.voucher_type 
    FROM rewards WHERE id = reward_id
  ) = expected_voucher_type;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE multiple_use_vouchers (
  id BIGINT PRIMARY KEY REFERENCES vouchers(id) ON DELETE CASCADE,
  reward_id UUID UNIQUE NOT NULL REFERENCES rewards(id) ON DELETE RESTRICT,
  redeemable_until TIMESTAMPTZ,
  has_usage_cap BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_matches(reward_id, 'MULTIPLE_USE')
  )
);

CREATE TRIGGER multiple_use_vouchers_update_trigger
BEFORE UPDATE ON multiple_use_vouchers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE single_use_vouchers (
  id BIGINT PRIMARY KEY REFERENCES vouchers(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE RESTRICT,
  redeemable_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_matches(reward_id, 'SINGLE_USE')
  )
);

CREATE TRIGGER single_use_vouchers_update_trigger
BEFORE UPDATE ON single_use_vouchers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE code_based_voucher_values (
  id BIGSERIAL PRIMARY KEY,
  voucher_id BIGINT UNIQUE NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  redemption_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER code_based_voucher_values_update_trigger
BEFORE UPDATE ON code_based_voucher_values
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE code_based_voucher_value_details_translations (
  code_based_voucher_value_id BIGINT REFERENCES code_based_voucher_values(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES languages(language_code) ON DELETE RESTRICT,
  instructions TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (code_based_voucher_value_id, language_code)
);

CREATE TRIGGER code_based_voucher_value_details_translations_update_trigger
BEFORE UPDATE ON code_based_voucher_value_details_translations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE qr_code_based_voucher_values (
  id BIGSERIAL PRIMARY KEY,
  voucher_id BIGINT UNIQUE NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  redemption_qr_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER qr_code_based_voucher_values_update_trigger
BEFORE UPDATE ON qr_code_based_voucher_values
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE qr_code_based_voucher_value_details_translations (
  qr_code_based_voucher_value_id BIGINT REFERENCES qr_code_based_voucher_values(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES languages(language_code) ON DELETE RESTRICT,
  instructions TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (qr_code_based_voucher_value_id, language_code)
);

CREATE TRIGGER qr_code_based_voucher_value_details_translations_update_trigger
BEFORE UPDATE ON qr_code_based_voucher_value_details_translations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE localized_link_based_voucher_values (
  voucher_id BIGINT REFERENCES vouchers(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES languages(language_code) ON DELETE RESTRICT,
  instructions TEXT NOT NULL,
  redemption_link_url TEXT NOT NULL,
  redemption_link_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(voucher_id, language_code)
);

CREATE TRIGGER localized_link_based_voucher_values_update_trigger
BEFORE UPDATE ON localized_link_based_voucher_values
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE localized_link_based_voucher_values;
DROP TABLE qr_code_based_voucher_value_details_translations;
DROP TABLE qr_code_based_voucher_values;
DROP TABLE code_based_voucher_value_details_translations;
DROP TABLE code_based_voucher_values;
DROP TABLE single_use_vouchers;
DROP TABLE multiple_use_vouchers;
DROP FUNCTION reward_voucher_type_matches;
DROP TABLE vouchers;