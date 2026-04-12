-- migrate:up
CREATE MATERIALIZED VIEW v_active_partner AS 
SELECT p.id
FROM partner p
INNER JOIN partner_details_translation pd
ON p.id = pd.partner_id
WHERE p.is_active
GROUP BY p.id
/*
  Check that the partner has translated details in all
  supported languages.
*/
HAVING ARRAY_AGG(
  pd.language_tag ORDER BY pd.language_tag
) = ARRAY(
  SELECT l.language_tag 
  FROM language l
  ORDER BY l.language_tag
);

CREATE UNIQUE INDEX v_active_partner_id_idx ON v_active_partner (id);

COMMENT ON MATERIALIZED VIEW v_active_partner IS 
$$
@introspeql-include

A materialized view that includes only partners that meet the following 
conditions:

- The partner is active
- The partner has translated details in all supported languages

Must be refreshed after insert, update, and delete operations are performed 
on the following tables:

- partner
- partner_details_translation
- language
$$;

CREATE MATERIALIZED VIEW v_valid_reward AS 
SELECT r.* FROM reward r
-- The reward's partner must be active
INNER JOIN v_active_partner p ON r.partner_id = p.id
INNER JOIN reward_details_translation rd ON r.id = rd.reward_id
GROUP BY r.id
HAVING 
  -- The reward must have translated details in all supported languages.
  ARRAY_AGG(
    rd.language_tag 
    ORDER BY rd.language_tag
  ) = ARRAY(
    SELECT l.language_tag 
    FROM language l
    ORDER BY l.language_tag
  ) 
  -- All of the reward's categories must have translations in all supported languages.
  AND TRUE = ALL(
    SELECT ARRAY_AGG(
	  ct.language_tag 
	  ORDER BY ct.language_tag
	) = ARRAY(
	  SELECT language_tag 
	  FROM language 
	  ORDER BY language_tag
	)
    FROM category c
    LEFT JOIN category_translation ct ON ct.category_id = c.id
    WHERE c.id IN (
      SELECT rc.category_id
      FROM reward_category rc
      WHERE rc.reward_id = r.id
    )
    GROUP BY c.id
  );

CREATE UNIQUE INDEX v_valid_reward_id_idx ON v_valid_reward (id);


COMMENT ON MATERIALIZED VIEW v_valid_reward IS 
$$
A materialized view that includes only rewards that meet the following 
conditions:

- A record with id = reward.partner_id exists in v_active_partner
- The reward has translated details in all supported languages
- Each category for the reward has translations in all supported languages

Must be refreshed after the following views are refreshed:

- v_active_partner

Must be refreshed after insert, update, and delete operations are performed 
on the following tables:

- reward
- reward_details_translation
- reward_category
- category
- category_translation
- language
$$;

CREATE VIEW v_available_single_use_voucher AS 
SELECT v.*
FROM single_use_voucher v
-- The voucher must be unexpired
WHERE NOW() < v.redeemable_until
-- The voucher must at have at least one value
AND
(
  EXISTS (
    SELECT 1 FROM code_based_voucher_value cv
    WHERE cv.single_use_voucher_id = v.id
  ) OR EXISTS (
    SELECT 1 FROM qr_code_based_voucher_value qv
    WHERE qv.single_use_voucher_id = v.id
  ) OR EXISTS (
    SELECT 1 FROM link_based_voucher_value lv
    WHERE lv.single_use_voucher_id = v.id
  )
)
-- All values that exist must have translations in all supported languages
AND (
  -- Either no code-based voucher value exists...
  NOT EXISTS (
    SELECT 1 FROM code_based_voucher_value cv
    WHERE cv.single_use_voucher_id = v.id
  ) 
  -- ...or it must have translated details in all supported languages
  OR EXISTS (
    SELECT cv.id 
    FROM code_based_voucher_value cv
    INNER JOIN code_based_voucher_value_details_translation cvd
      ON cv.id = cvd.code_based_voucher_value_id
    WHERE cv.single_use_voucher_id = v.id
    GROUP BY cv.id
    HAVING ARRAY_AGG(
      cvd.language_tag ORDER BY cvd.language_tag
    ) = ARRAY(
      SELECT l.language_tag 
      FROM language l
      ORDER BY l.language_tag
    )
  ) 
)
AND (
  -- Either no qr-based voucher value exists...
  NOT EXISTS (
    SELECT 1 FROM qr_code_based_voucher_value qv
    WHERE qv.single_use_voucher_id = v.id
  ) 
  -- ...or it must have translated details in all supported languages
  OR EXISTS (
    SELECT qv.id 
    FROM qr_code_based_voucher_value qv
    INNER JOIN qr_code_based_voucher_value_details_translation qvd
      ON qv.id = qvd.qr_code_based_voucher_value_id
    WHERE qv.single_use_voucher_id = v.id
    GROUP BY qv.id
    HAVING ARRAY_AGG(
      qvd.language_tag ORDER BY qvd.language_tag
    ) = ARRAY(
      SELECT l.language_tag 
      FROM language l
      ORDER BY l.language_tag
    )
  ) 
)
AND (
  -- Either no link-based voucher value exists...
  NOT EXISTS (
    SELECT 1 FROM link_based_voucher_value lv
    WHERE lv.single_use_voucher_id = v.id
  ) 
  -- ...or it must have translated details in all supported languages
  OR EXISTS (
    SELECT lv.id 
    FROM link_based_voucher_value lv
    INNER JOIN link_based_voucher_value_details_translation lvd
      ON lv.id = lvd.link_based_voucher_value_id
    WHERE lv.single_use_voucher_id = v.id
    GROUP BY lv.id
    HAVING ARRAY_AGG(
      lvd.language_tag ORDER BY lvd.language_tag
    ) = ARRAY(
      SELECT l.language_tag 
      FROM language l
      ORDER BY l.language_tag
    )
  ) 
);

COMMENT ON VIEW v_available_single_use_voucher IS 
$$
@introspeql-include

A view that includes only single-use vouchers that meet the following 
conditions:

- The voucher must be unexpired
- The voucher must have at minimum one code-based-, qr-code-based-, or 
  link-based-value 
- All values for the voucher must have translated details in all supported languages
$$;

CREATE VIEW v_available_multiple_use_voucher AS 
SELECT v.*
FROM multiple_use_voucher v
WHERE 
-- The voucher must be unexpired
NOW() < v.redeemable_until
-- The voucher must at have at least one value
AND
(
  EXISTS (
    SELECT 1 FROM code_based_voucher_value cv
    WHERE cv.multiple_use_voucher_id = v.id
  ) OR EXISTS (
    SELECT 1 FROM qr_code_based_voucher_value qv
    WHERE qv.multiple_use_voucher_id = v.id
  ) OR EXISTS (
    SELECT 1 FROM link_based_voucher_value lv
    WHERE lv.multiple_use_voucher_id = v.id
  )
)
-- All values that exist must have translations in all supported languages
AND (
  -- Either no code-based voucher value exists...
  NOT EXISTS (
    SELECT 1 FROM code_based_voucher_value cv
    WHERE cv.multiple_use_voucher_id = v.id
  ) 
  -- ...or it must have translated details in all supported languages
  OR EXISTS (
    SELECT cv.id 
    FROM code_based_voucher_value cv
    INNER JOIN code_based_voucher_value_details_translation cvd
      ON cv.id = cvd.code_based_voucher_value_id
    WHERE cv.multiple_use_voucher_id = v.id
    GROUP BY cv.id
    HAVING ARRAY_AGG(
      cvd.language_tag ORDER BY cvd.language_tag
    ) = ARRAY(
      SELECT l.language_tag 
      FROM language l
      ORDER BY l.language_tag
    )
  ) 
)
AND (
  -- Either no qr-based voucher value exists...
  NOT EXISTS (
    SELECT 1 FROM qr_code_based_voucher_value qv
    WHERE qv.multiple_use_voucher_id = v.id
  ) 
  -- ...or it must have translated details in all supported languages
  OR EXISTS (
    SELECT qv.id 
    FROM qr_code_based_voucher_value qv
    INNER JOIN qr_code_based_voucher_value_details_translation qvd
      ON qv.id = qvd.qr_code_based_voucher_value_id
    WHERE qv.multiple_use_voucher_id = v.id
    GROUP BY qv.id
    HAVING ARRAY_AGG(
      qvd.language_tag ORDER BY qvd.language_tag
    ) = ARRAY(
      SELECT l.language_tag 
      FROM language l
      ORDER BY l.language_tag
    )
  ) 
)
AND (
  -- Either no link-based voucher value exists...
  NOT EXISTS (
    SELECT 1 FROM link_based_voucher_value lv
    WHERE lv.multiple_use_voucher_id = v.id
  ) 
  -- ...or it must have translated details in all supported languages
  OR EXISTS (
    SELECT lv.id 
    FROM link_based_voucher_value lv
    INNER JOIN link_based_voucher_value_details_translation lvd
      ON lv.id = lvd.link_based_voucher_value_id
    WHERE lv.multiple_use_voucher_id = v.id
    GROUP BY lv.id
    HAVING ARRAY_AGG(
      lvd.language_tag ORDER BY lvd.language_tag
    ) = ARRAY(
      SELECT l.language_tag 
      FROM language l
      ORDER BY l.language_tag
    )
  ) 
);

COMMENT ON VIEW v_available_multiple_use_voucher IS 
$$
@introspeql-include

A view that includes only multiple-use vouchers that meet the following 
conditions:

- The voucher must be unexpired
- The voucher must have at minimum one code-based-, qr-code-based-, or 
  link-based-value 
- All values for the voucher must have translated details in all supported languages
$$;

CREATE VIEW v_available_manual_voucher_stub AS 
SELECT s.*
FROM manual_voucher_stub s 
INNER JOIN manual_voucher_stub_details_translation sd 
ON s.id = sd.manual_voucher_stub_id
WHERE s.vouchers_remaining > 0
AND NOW() < s.redeemable_until_exact
GROUP BY s.id
HAVING ARRAY_AGG(
  sd.language_tag ORDER BY language_tag
) = ARRAY (
  SELECT l.language_tag
  FROM language l
  ORDER BY l.language_tag
);

COMMENT ON VIEW v_available_manual_voucher_stub IS 
$$
@introspeql-include

A view that includes only manual voucher stubs that meet the following 
conditions:

- The voucher stub must have at least one voucher remaining
- The voucher stub must be unexpired
- The voucher stub must have translated details in all supported languages
$$;

CREATE VIEW v_available_on_demand_voucher_stub AS 
SELECT s.*
FROM on_demand_voucher_stub s
WHERE s.vouchers_remaining > 0
AND NOW() < s.redeemable_until_exact;

COMMENT ON VIEW v_available_on_demand_voucher_stub IS 
$$
@introspeql-include

A view that includes only on-demand voucher stubs that meet the following 
conditions:

- The voucher stub must have at least one voucher remaining
- The voucher stub must be unexpired
$$;

CREATE VIEW v_available_reward AS 
SELECT r.*
FROM v_valid_reward r
WHERE (r.available_from_exact IS NULL OR NOW() >= r.available_from_exact)
AND (r.available_until_exact IS NULL OR NOW() < r.available_until_exact)
AND (
  (
    r.voucher_type = 'SINGLE_USE' AND EXISTS (
      SELECT 1 FROM v_available_single_use_voucher v 
      WHERE v.reward_id = r.id
    )
  ) OR (
    r.voucher_type = 'MULTIPLE_USE' AND EXISTS (
      SELECT 1 FROM v_available_multiple_use_voucher v
      WHERE v.reward_id = r.id
    )
  ) OR (
    r.voucher_type = 'MANUAL'
    AND EXISTS (
      SELECT 1 FROM v_available_manual_voucher_stub s 
      WHERE s.reward_id = r.id
    )
  ) OR (
    r.voucher_type = 'ON_DEMAND'
    AND EXISTS (
      SELECT 1 FROM v_available_on_demand_voucher_stub s 
      WHERE s.reward_id = r.id
    )
  )
);

COMMENT ON VIEW v_available_reward IS
$$
@introspeql-include

A view that includes only rewards that meet the following conditions:

- The reward exists in v_valid_reward
- The reward is currently available (according to available_from_exact and available_until_exact)
- The reward has an available voucher or voucher stub
$$;


-- migrate:down
DROP VIEW v_available_reward;
DROP VIEW v_available_on_demand_voucher_stub;
DROP VIEW v_available_manual_voucher_stub;
DROP VIEW v_available_multiple_use_voucher;
DROP VIEW v_available_single_use_voucher;
DROP MATERIALIZED VIEW v_valid_reward;
DROP MATERIALIZED VIEW v_active_partner;