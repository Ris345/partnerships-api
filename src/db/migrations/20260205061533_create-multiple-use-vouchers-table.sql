-- migrate:up
CREATE TABLE multiple_use_vouchers (
  reward_id UUID PRIMARY KEY REFERENCES rewards(id) ON DELETE CASCADE,
  has_usage_cap BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_is_match(reward_id, 'multiple_use')
  )
) INHERITS (base_vouchers);

COMMENT ON TABLE multiple_use_vouchers IS $$
A voucher that can be shared amongst all users. Only one such voucher can 
exist for a given reward. The voucher_type of the reward must be multiple_use.

@introspeql-include
$$;

COMMENT ON COLUMN multiple_use_vouchers.has_usage_cap IS $$
If has_usage_cap is true, the partner has set a limit on the number of times 
the voucher can be used. 

This type of reward should be handled as a special case, 
for instance, by displaying its value to all users regardless of whether they 
have claimed it.
$$;

-- migrate:down
DROP TABLE multiple_use_vouchers;
