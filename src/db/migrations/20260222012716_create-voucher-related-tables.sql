-- migrate:up
CREATE TABLE base_voucher (
  redeemable_until TIMESTAMPTZ,
  CONSTRAINT disallow_insert CHECK (false) NO INHERIT
) INHERITS (base_entity);

COMMENT ON TABLE base_voucher IS '@introspeql-include';

CREATE TABLE single_use_voucher (
  id BIGSERIAL PRIMARY KEY,
  reward_id UUID NOT NULL REFERENCES reward(id) ON DELETE CASCADE,
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_matches(reward_id, 'SINGLE_USE')
  )
) INHERITS (base_voucher);

COMMENT ON TABLE single_use_voucher IS '@introspeql-include';

CREATE TRIGGER single_use_voucher_update_trigger
BEFORE UPDATE ON single_use_voucher
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE multiple_use_voucher (
  id SERIAL PRIMARY KEY,
  reward_id UUID UNIQUE NOT NULL REFERENCES reward(id) ON DELETE CASCADE, 
  has_usage_cap BOOLEAN NOT NULL,
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_matches(reward_id, 'MULTIPLE_USE')
  )
) INHERITS (base_voucher);

COMMENT ON TABLE multiple_use_voucher IS '@introspeql-include';

CREATE TRIGGER multiple_use_voucher_update_trigger
BEFORE UPDATE ON multiple_use_voucher
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE code_based_voucher_value (
  id BIGSERIAL PRIMARY KEY,
  single_use_voucher_id BIGINT UNIQUE NULLS DISTINCT REFERENCES single_use_voucher(id) ON DELETE CASCADE,
  multiple_use_voucher_id INT UNIQUE NULLS DISTINCT REFERENCES multiple_use_voucher(id) ON DELETE CASCADE,
  redemption_code TEXT NOT NULL,
  CONSTRAINT disallow_references_to_multiple_vouchers CHECK (num_nonnulls(
    multiple_use_voucher_id,
    single_use_voucher_id
  ) = 1)
) INHERITS (base_entity);

COMMENT ON TABLE code_based_voucher_value IS '@introspeql-include';

CREATE TRIGGER code_based_voucher_value_update_trigger
BEFORE UPDATE ON code_based_voucher_value
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE code_based_voucher_value_details_translation (
  code_based_voucher_value_id BIGINT REFERENCES code_based_voucher_value(id) ON DELETE CASCADE,
  language_tag TEXT REFERENCES language(language_tag) ON DELETE RESTRICT,
  instructions TEXT NOT NULL,
  PRIMARY KEY (code_based_voucher_value_id, language_tag)
) INHERITS (base_entity);

COMMENT ON TABLE code_based_voucher_value_details_translation IS '@introspeql-include';

CREATE TRIGGER code_based_voucher_value_details_translation_update_trigger
BEFORE UPDATE ON code_based_voucher_value_details_translation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE qr_code_based_voucher_value (
  id BIGSERIAL PRIMARY KEY,
  single_use_voucher_id BIGINT UNIQUE NULLS DISTINCT REFERENCES single_use_voucher(id) ON DELETE CASCADE,
  multiple_use_voucher_id INT UNIQUE NULLS DISTINCT REFERENCES multiple_use_voucher(id) ON DELETE CASCADE,
  redemption_qr_code TEXT NOT NULL,
  CONSTRAINT disallow_references_to_multiple_vouchers CHECK (num_nonnulls(
    multiple_use_voucher_id,
    single_use_voucher_id
  ) = 1)
) INHERITS (base_entity);

COMMENT ON TABLE qr_code_based_voucher_value IS '@introspeql-include';

CREATE TRIGGER qr_code_based_voucher_value_update_trigger
BEFORE UPDATE ON qr_code_based_voucher_value
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE qr_code_based_voucher_value_details_translation (
  qr_code_based_voucher_value_id BIGINT REFERENCES qr_code_based_voucher_value(id) ON DELETE CASCADE,
  language_tag TEXT REFERENCES language(language_tag) ON DELETE RESTRICT,
  instructions TEXT NOT NULL,
  PRIMARY KEY (qr_code_based_voucher_value_id, language_tag)
) INHERITS (base_entity);

COMMENT ON TABLE qr_code_based_voucher_value_details_translation IS '@introspeql-include';

CREATE TRIGGER qr_code_based_voucher_value_details_translation_update_trigger
BEFORE UPDATE ON qr_code_based_voucher_value_details_translation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE link_based_voucher_value (
  id BIGSERIAL PRIMARY KEY,
  single_use_voucher_id BIGINT UNIQUE NULLS DISTINCT REFERENCES single_use_voucher(id) ON DELETE CASCADE,
  multiple_use_voucher_id INT UNIQUE NULLS DISTINCT REFERENCES multiple_use_voucher(id) ON DELETE CASCADE,
  CONSTRAINT disallow_references_to_multiple_vouchers CHECK (num_nonnulls(
    multiple_use_voucher_id,
    single_use_voucher_id
  ) = 1)
) INHERITS (base_entity);

COMMENT ON TABLE link_based_voucher_value IS '@introspeql-include';

CREATE TRIGGER link_based_voucher_value_update_trigger
BEFORE UPDATE ON link_based_voucher_value
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE link_based_voucher_value_details_translation (
  link_based_voucher_value_id BIGINT REFERENCES link_based_voucher_value(id) ON DELETE CASCADE,
  language_tag TEXT REFERENCES language(language_tag) ON DELETE RESTRICT,
  instructions TEXT NOT NULL,
  redemption_link_url TEXT NOT NULL,
  redemption_link_text TEXT,
  PRIMARY KEY (link_based_voucher_value_id, language_tag)
) INHERITS (base_entity);

COMMENT ON TABLE link_based_voucher_value_details_translation IS '@introspeql-include';

CREATE TRIGGER link_based_voucher_value_details_translation_update_trigger
BEFORE UPDATE ON link_based_voucher_value_details_translation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE link_based_voucher_value_details_translation;
DROP TABLE link_based_voucher_value;
DROP TABLE qr_code_based_voucher_value_details_translation;
DROP TABLE qr_code_based_voucher_value;
DROP TABLE code_based_voucher_value_details_translation;
DROP TABLE code_based_voucher_value;
DROP TABLE multiple_use_voucher;
DROP TABLE single_use_voucher;
DROP TABLE base_voucher;
