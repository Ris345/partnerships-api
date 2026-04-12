-- migrate:up
CREATE FUNCTION get_translated_reward_categories(reward_id UUID, language_tag TEXT)
RETURNS TEXT[] AS $$
  DECLARE category_translations TEXT[];
  BEGIN
    SELECT ARRAY_AGG(c.category_name ORDER BY c.category_name) 
    INTO category_translations
    FROM category_translation c
    INNER JOIN reward_category r ON c.category_id = r.category_id
    WHERE r.reward_id = get_translated_reward_categories.reward_id
      AND c.language_tag = get_translated_reward_categories.language_tag;

    RETURN category_translations;
  END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_translated_reward_categories IS 
$$
@introspeql-include
@introspeql-disable-nullable-return-types
$$;

CREATE FUNCTION has_usage_or_quantity_limit(reward_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT 
      r.voucher_type = 'SINGLE_USE' OR
      (
        r.voucher_type = 'MULTIPLE_USE' AND (
          SELECT v.has_usage_cap 
          FROM multiple_use_voucher v 
          WHERE v.reward_id = r.id
        )
      ) OR (
        r.voucher_type = 'MANUAL' AND (
          SELECT s.vouchers_remaining IS NOT NULL
          FROM manual_voucher_stub s
          WHERE s.reward_id = r.id
        )
      ) OR (
        r.voucher_type = 'ON_DEMAND' AND (
          SELECT s.vouchers_remaining IS NOT NULL
          FROM on_demand_voucher_stub s
          WHERE s.reward_id = r.id
        )
      )
    FROM v_available_reward r
    WHERE r.id = has_usage_or_quantity_limit.reward_id
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION has_usage_or_quantity_limit IS 
$$
@introspeql-include
@introspeql-disable-nullable-return-types
$$;

-- migrate:down
DROP FUNCTION has_usage_or_quantity_limit;
DROP FUNCTION get_translated_reward_categories;

