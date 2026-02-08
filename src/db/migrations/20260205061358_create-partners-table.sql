-- migrate:up
CREATE TABLE partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT,
  website_link_text TEXT,
  reason_for_supporting_8by8 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE partners IS $$
Businesses that have partnered with 8by8 to offer rewards to users of 
8by8 applications.

@introspeql-include
$$;

CREATE TRIGGER partners_update_trigger 
BEFORE UPDATE ON partners 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE partners;
