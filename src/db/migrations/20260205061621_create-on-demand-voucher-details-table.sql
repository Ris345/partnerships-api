-- migrate:up
CREATE TABLE on_demand_voucher_details (
  reward_id UUID PRIMARY KEY REFERENCES rewards(id) ON DELETE CASCADE,
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_is_match(reward_id, 'on_demand')
  )
) INHERITS (base_voucher_details);

COMMENT ON TABLE on_demand_voucher_details IS $$
A table that describes information about a voucher that is retrieved on demand, 
such as by invoking a serverless function that calls out to an API belonging 
to the partner.

Only one such voucher details object can exist for a given reward. The 
voucher_type of the reward must be on_demand.

@introspeql-include
$$;

-- migrate:down
DROP TABLE on_demand_voucher_details;
