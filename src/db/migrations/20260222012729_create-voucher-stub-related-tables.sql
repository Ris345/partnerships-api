-- migrate:up
CREATE TABLE base_voucher_stub (
  redeemable_until_exact TIMESTAMPTZ,
  redeemable_until_local TIMESTAMP,
  redeemable_for INTERVAL,
  vouchers_remaining INT,
  CONSTRAINT disallow_insert CHECK (false) NO INHERIT
) INHERITS (base_entity);

COMMENT ON TABLE base_voucher_stub IS '@introspeql-include';

CREATE TABLE on_demand_voucher_stub (
  id SERIAL PRIMARY KEY,
  reward_id UUID NOT NULL UNIQUE REFERENCES reward(id) ON DELETE CASCADE,
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_matches(reward_id, 'ON_DEMAND')
  )
) INHERITS (base_voucher_stub);

COMMENT ON TABLE on_demand_voucher_stub IS '@introspeql-include';

CREATE TRIGGER on_demand_voucher_stub_update_trigger
BEFORE UPDATE ON on_demand_voucher_stub
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE manual_voucher_stub (
  id SERIAL PRIMARY KEY,
  reward_id UUID NOT NULL UNIQUE REFERENCES reward(id) ON DELETE CASCADE,
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_matches(reward_id, 'MANUAL')
  )
) INHERITS (base_voucher_stub);

COMMENT ON TABLE manual_voucher_stub IS '@introspeql-include';

CREATE TRIGGER manual_voucher_stub_update_trigger
BEFORE UPDATE ON manual_voucher_stub
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE manual_voucher_stub_details_translation (
  manual_voucher_stub_id INT REFERENCES manual_voucher_stub(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES language(language_code) ON DELETE RESTRICT,
  instructions TEXT NOT NULL,
  PRIMARY KEY (manual_voucher_stub_id, language_code)
) INHERITS (base_entity);

COMMENT ON TABLE manual_voucher_stub_details_translation IS '@introspeql-include';

CREATE TRIGGER manual_voucher_stub_details_translation_update_trigger
BEFORE UPDATE ON manual_voucher_stub_details_translation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE manual_voucher_stub_details_translation;
DROP TABLE manual_voucher_stub;
DROP TABLE on_demand_voucher_stub;
DROP TABLE base_voucher_stub;

