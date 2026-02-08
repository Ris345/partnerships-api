-- migrate:up
CREATE TABLE base_vouchers (
  redeemable_until TIMESTAMPTZ,
  redemption_methods redemption_method[] NOT NULL,
  instructions TEXT NOT NULL,
  redemption_code TEXT,
  redemption_qr_code TEXT,
  redemption_link_url TEXT,
  redemption_link_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT redemption_methods_is_not_empty CHECK (CARDINALITY(redemption_methods) > 0),
  CONSTRAINT redemption_methods_contains_no_duplicates CHECK (NOT contains_duplicates (redemption_methods)),
  /*
    Checks that the appropriate voucher values are included for each redemption 
    method included in the redemption_methods array. redemption_link_text is 
    always optional, redemption_link_url can be used as the default value.
  */
  CONSTRAINT validate_redemption_methods_and_voucher_values CHECK (
    (CASE WHEN 'code' = ANY(redemption_methods) THEN redemption_code IS NOT NULL ELSE redemption_code IS NULL END) AND 
    (CASE WHEN 'qr_code' = ANY(redemption_methods) THEN redemption_qr_code IS NOT NULL ELSE redemption_qr_code IS NULL END) AND 
    (CASE 
      WHEN 'link' = ANY(redemption_methods) 
        THEN redemption_link_url IS NOT NULL 
      ELSE 
        redemption_link_url IS NULL AND redemption_link_text IS NULL 
      END
    )
  ),
  CONSTRAINT prevent_direction_insertions CHECK (false) NO INHERIT
);

COMMENT ON TABLE base_vouchers IS $$
Contains common properties shared by multiple-use vouchers and single-use 
vouchers. Rows cannot be directly inserted into this table.
$$;

CREATE TRIGGER base_vouchers_update_trigger 
BEFORE UPDATE ON base_vouchers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE base_vouchers;
