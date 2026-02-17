-- migrate:up
CREATE TABLE base_voucher_stubs (
  redeemable_until_exact TIMESTAMPTZ,
  redeemable_until_local TIMESTAMP,
  redeemable_for INTERVAL,
  vouchers_remaining INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE on_demand_voucher_stubs (
  reward_id UUID PRIMARY KEY REFERENCES rewards(id) ON DELETE CASCADE
) INHERITS (base_voucher_stubs);

CREATE TRIGGER on_demand_voucher_stubs_update_trigger
BEFORE UPDATE ON on_demand_voucher_stubs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE manual_voucher_stubs (
  id SERIAL PRIMARY KEY,
  reward_id UUID UNIQUE REFERENCES rewards(id) ON DELETE CASCADE
) INHERITS (base_voucher_stubs);

CREATE TRIGGER manual_voucher_stubs_update_trigger
BEFORE UPDATE ON manual_voucher_stubs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE manual_voucher_stub_details_translations (
  manual_voucher_stub_id INT REFERENCES manual_voucher_stubs(id) ON DELETE CASCADE,
  language_code CHAR(2) REFERENCES languages(language_code) ON DELETE RESTRICT,
  instructions TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (manual_voucher_stub_id, language_code)
);

CREATE TRIGGER manual_voucher_stub_details_translations_update_trigger
BEFORE UPDATE ON manual_voucher_stub_details_translations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE manual_voucher_stub_details_translations;
DROP TABLE manual_voucher_stubs;
DROP TABLE on_demand_voucher_stubs;
DROP TABLE base_voucher_stubs;
