-- migrate:up
CREATE TABLE rewards (
  id UUID PRIMARY KEY,
  partner_id VARCHAR(255) NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  short_description VARCHAR(255) NOT NULL,
  redemption_forums redemption_forum[] NOT NULL,
  voucher_type voucher_type NOT NULL,
  long_description TEXT,
  claimable_from TIMESTAMPTZ,
  claimable_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT redemption_forums_is_not_empty CHECK (CARDINALITY(redemption_forums) > 0),
  CONSTRAINT redemption_forums_contains_no_duplicates CHECK (NOT contains_duplicates (redemption_forums))
);

COMMENT ON TABLE rewards IS $$
Rewards offered by partners. Each partner may have between zero and many rewards.

@introspeql-include
$$;

CREATE TRIGGER rewards_update_trigger 
BEFORE UPDATE ON rewards
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE rewards;
