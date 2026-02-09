-- migrate:up
CREATE TABLE reward_categories (
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(reward_id, category_id)
);

COMMENT ON TABLE reward_categories IS $$
A junction table that allows for a many-to-many relationship between rewards and 
categories.

@introspeql-include
$$;

CREATE TRIGGER reward_categories_update_trigger 
BEFORE UPDATE ON reward_categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE reward_categories;