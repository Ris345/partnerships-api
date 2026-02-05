-- migrate:up
CREATE TABLE single_use_vouchers (
  id SERIAL PRIMARY KEY,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_is_match(reward_id, 'single_use')
  )
) INHERITS (base_vouchers);

COMMENT ON TABLE single_use_vouchers IS $$
A voucher that that can be returned to one user. Once the voucher is retrieved, 
it is deleted from the database. 

Each reward can have multiple single-use vouchers. The voucher_type for the 
reward must be single_use.

This type of voucher will typically be generated in batches by a partner and 
then uploaded to the database in batches by an 8by8 team member.

@introspeql-include
$$;

-- migrate:down
DROP TABLE single_use_vouchers;