-- migrate:up
CREATE TYPE distance_units AS ENUM ('METERS', 'KILOMETERS', 'MILES');

CREATE TYPE voucher_ownership AS ENUM ('SINGLE_USER', 'MULTI_USER');

CREATE TYPE redemption_forum AS ENUM ('ONLINE', 'IN_STORE');

CREATE TYPE voucher_type AS ENUM (
 'MULTIPLE_USE',
 'SINGLE_USE',
 'ON_DEMAND',
 'MANUAL'
);

CREATE TYPE redemption_method AS ENUM ('CODE', 'QR_CODE', 'LINK', 'MANUAL');

-- migrate:down
DROP TYPE redemption_method;
DROP TYPE voucher_type;
DROP TYPE redemption_forum;
DROP TYPE reward_type;
DROP TYPE distance_units;

