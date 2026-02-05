-- migrate:up
CREATE TABLE manual_voucher_details (
  reward_id UUID PRIMARY KEY REFERENCES rewards(id) ON DELETE CASCADE,
  instructions TEXT NOT NULL,
  CONSTRAINT validate_reward_voucher_type CHECK (
    reward_voucher_type_is_match(reward_id, 'manual')
  )
) INHERITS (base_voucher_details);

COMMENT ON TABLE manual_voucher_details IS $$
A table that describes vouchers that can be redeemed manually by displaying an 
8by8 app to an employee of a partner at one of their physical locations and 
pressing a button in the app to flag the reward as redeemed. This process should 
be handled by the client application. The Partnerships API merely returns 
information about the voucher.

Only one such voucher details object can exist for a given reward. The 
voucher_type of the reward must be manual.

@introspeql-include
$$;

-- migrate:down
DROP TABLE manual_voucher_details;
