-- migrate:up
CREATE TABLE reward (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id INT NOT NULL REFERENCES partner(id) ON DELETE RESTRICT,
  redemption_forums redemption_forum[] NOT NULL,
  voucher_type voucher_type NOT NULL,
  available_from_exact TIMESTAMPTZ,
  available_until_exact TIMESTAMPTZ,
  available_from_local TIMESTAMP,
  available_until_local TIMESTAMP,
  CONSTRAINT redemption_forums_is_not_empty CHECK (CARDINALITY(redemption_forums) > 0),
  CONSTRAINT redemption_forums_contains_no_duplicates CHECK (NOT contains_duplicates (redemption_forums))
) INHERITS (base_entity);

COMMENT ON TABLE reward IS '@introspeql-include';

CREATE TRIGGER reward_update_trigger
BEFORE UPDATE ON reward
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE reward_category (
  reward_id UUID REFERENCES reward(id) ON DELETE CASCADE,
  category_id INT REFERENCES category(id) ON DELETE RESTRICT,
  PRIMARY KEY(reward_id, category_id)
) INHERITS (base_entity);

COMMENT ON TABLE reward_category IS '@introspeql-include';

CREATE TRIGGER reward_category_update_trigger
BEFORE UPDATE ON reward_category
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE reward_details_translation (
  reward_id UUID NOT NULL REFERENCES reward(id) ON DELETE CASCADE,
  language_tag TEXT NOT NULL REFERENCES language(language_tag) ON DELETE RESTRICT,
  short_description TEXT NOT NULL,
  long_description TEXT,
  PRIMARY KEY(reward_id, language_tag)
) INHERITS (base_entity);

COMMENT ON TABLE reward_details_translation IS '@introspeql-include';

CREATE TRIGGER reward_details_translation_update_trigger
BEFORE UPDATE ON reward_details_translation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE FUNCTION reward_voucher_type_matches(
  reward_id UUID, 
  expected_voucher_type voucher_type
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT voucher_type 
    FROM reward WHERE id = reward_id
  ) = expected_voucher_type;
END;
$$ LANGUAGE plpgsql;

-- migrate:down
DROP FUNCTION reward_voucher_type_matches;
DROP TABLE reward_details_translation;
DROP TABLE reward_category;
DROP TABLE reward;
