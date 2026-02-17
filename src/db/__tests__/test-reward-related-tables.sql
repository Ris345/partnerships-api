CREATE FUNCTION public.test_rewards_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE 
  test_partner_id INT;
  test_reward_id UUID;
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN 
INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

INSERT INTO rewards (
  partner_id,
  redemption_forums,
  voucher_type
) VALUES (
  test_partner_id,
  '{"ONLINE", "IN_STORE"}',
  'MULTIPLE_USE'
) RETURNING id, updated_at INTO test_reward_id, original_updated_at;

UPDATE rewards SET voucher_type = 'SINGLE_USE'
WHERE id = test_reward_id
RETURNING updated_at INTO new_updated_at;

RETURN QUERY (
  SELECT ok(
    new_updated_at > original_updated_at,
    'rewards.updated_at was set when a row was updated.'
  )
);
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_redemption_methods_must_not_be_empty() 
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $select_statement$
        INSERT INTO rewards (
          partner_id,
          redemption_forums,
          voucher_type
        ) VALUES (
          %L,
          '{}',
          'MULTIPLE_USE'
        )
        $select_statement$,
        test_partner_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;


CREATE FUNCTION public.test_redemption_methods_must_not_contain_duplicate_values() 
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $select_statement$
        INSERT INTO rewards (
          partner_id,
          redemption_forums,
          voucher_type
        ) VALUES (
          %L,
          '{"ONLINE", "ONLINE", "IN_STORE"}',
          'MULTIPLE_USE'
        )
        $select_statement$,
        test_partner_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_reward_categories_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
  original_category_id INT;
  new_category_id INT;
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO rewards (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'MULTIPLE_USE'
  ) RETURNING id INTO test_reward_id;


  INSERT INTO categories DEFAULT VALUES RETURNING id INTO original_category_id;

  INSERT INTO reward_categories (reward_id, category_id)
  VALUES (test_reward_id, original_category_id)
  RETURNING updated_at INTO original_updated_at;

  INSERT INTO categories DEFAULT VALUES RETURNING id INTO new_category_id;

  UPDATE reward_categories SET category_id = new_category_id 
  WHERE reward_id = test_reward_id AND category_id = original_category_id
  RETURNING updated_at INTO new_updated_at;

  RETURN QUERY (
    SELECT ok(
      new_updated_at > original_updated_at,
      'reward_categories.updated_at was set when a row was updated.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_reward_details_translations_update_trigger()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
  test_language_code CHAR(2) := 'EN';
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO rewards (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'ON_DEMAND'
  ) RETURNING id INTO test_reward_id;

  INSERT INTO languages (language_code, language_name) VALUES (
    test_language_code,
    'English'
  );

  INSERT INTO reward_details_translations (
    reward_id,
    language_code,
    short_description
  ) VALUES (
    test_reward_id,
    test_language_code,
    anon.lorem_ipsum(words => 5)
  ) RETURNING updated_at INTO original_updated_at;

  UPDATE reward_details_translations 
  SET short_description = anon.lorem_ipsum(words => 5)
  WHERE reward_id = test_reward_id AND language_code = test_language_code
  RETURNING updated_at INTO new_updated_at;

  RETURN QUERY (
    SELECT ok(
      new_updated_at > original_updated_at,
      'reward_details_translations.updated_at was set when a row was updated.'
    )
  );
END;
$$ LANGUAGE plpgsql;