-- migrate:up
CREATE TYPE redemption_forum AS ENUM ('ONLINE', 'IN_STORE');
CREATE TYPE voucher_type AS ENUM (
 'MULTIPLE_USE',
 'SINGLE_USE',
 'ON_DEMAND',
 'MANUAL'
);

CREATE TYPE redemption_method AS ENUM ('CODE', 'QR_CODE', 'LINK', 'MANUAL');
CREATE TYPE distance_units AS ENUM ('METERS', 'KILOMETERS', 'MILES');

-- migrate:down
DROP TYPE distance_units;
DROP TYPE redemption_method;
DROP TYPE voucher_type;
DROP TYPE redemption_forum;