-- migrate:up
CREATE TABLE language_codes (
  id SERIAL PRIMARY KEY,
  code CHAR(2) UNIQUE NOT NULL
);

COMMENT ON TABLE language_codes IS 
$$
Contains ISO-639-1 language codes that represent the languages in which data 
from the 8by8 Partnerships API can be returned.

@introspeql-include
$$;

-- migrate:down
DROP TABLE language_codes;
