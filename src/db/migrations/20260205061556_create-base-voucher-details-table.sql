-- migrate:up
CREATE TABLE base_voucher_details (
  redeemable_until TIMESTAMPTZ,
  redeemable_for INTERVAL,
  vouchers_remaining INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT prevent_direction_insertions CHECK (false) NO INHERIT
);

CREATE TRIGGER base_voucher_details_update_trigger
BEFORE UPDATE ON base_voucher_details
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE base_voucher_details IS $$
Contains common properties shared by manual vouchers and on-demand
vouchers. Rows cannot be directly inserted into this table.
$$;

-- migrate:down
DROP TABLE base_voucher_details;