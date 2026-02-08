-- migrate:up
CREATE FUNCTION reward_voucher_type_is_match(reward_id UUID, voucher_type voucher_type)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT rewards.voucher_type 
    FROM rewards WHERE id = reward_id
  ) = reward_voucher_type_is_match.voucher_type;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reward_voucher_type_is_match IS $$
A function that can be used in check constraints to ensure that a given reward 
has the appropriate type of voucher or voucher details object(s).
$$;

-- migrate:down
DROP FUNCTION reward_voucher_type_is_match;

