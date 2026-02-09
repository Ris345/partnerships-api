-- migrate:up
CREATE TYPE redemption_forum AS ENUM ('online', 'in_store');
COMMENT ON TYPE redemption_forum IS $$
A enum that describes where a given reward can be redeemed.
$$;

CREATE TYPE voucher_type AS ENUM (
  'multiple_use', 
  'single_use', 
  'manual', 
  'on_demand'
);

COMMENT ON TYPE voucher_type IS $$
An enum that describes the mechanism by which a voucher will be remitted to the 
user. Can be used to show certain types of vouchers, such as multiple-use 
vouchers with a usage cap, to all users regardless of whether the user has 
claimed the reward.
$$;

CREATE TYPE redemption_method AS ENUM ('code', 'qr_code', 'link');
COMMENT ON TYPE redemption_method IS $$
An enum that describes the mechanism(s) by which a particular voucher may be 
redeemed.
$$;


CREATE TYPE distance_units AS ENUM ('meters', 'kilometers', 'miles');
COMMENT ON TYPE distance_units IS $$
Units of measurement in which the results of distance calculations can be 
returned and in which distance-based filters can be described.
$$;

-- migrate:down
DROP TYPE redemption_forum;
DROP TYPE voucher_type;
DROP TYPE redemption_method;
DROP TYPE distance_units;

