CREATE FUNCTION public.test_multiple_use_voucher_can_reference_multiple_use_voucher_reward()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'MULTIPLE_USE'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT lives_ok(
      FORMAT(
        $insert_statement$
        INSERT INTO multiple_use_voucher (
          reward_id,
          has_usage_cap
        ) VALUES (
          %L,
          false
        );
        $insert_statement$,
        test_reward_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_multiple_use_voucher_cannot_reference_single_use_voucher_reward()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'SINGLE_USE'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $insert_statement$
        INSERT INTO multiple_use_voucher (
          reward_id,
          has_usage_cap
        ) VALUES (
          %L,
          false
        );
        $insert_statement$,
        test_reward_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;


CREATE FUNCTION public.test_multiple_use_voucher_cannot_reference_on_demand_voucher_reward()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'ON_DEMAND'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $insert_statement$
        INSERT INTO multiple_use_voucher (
          reward_id,
          has_usage_cap
        ) VALUES (
          %L,
          false
        );
        $insert_statement$,
        test_reward_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;


CREATE FUNCTION public.test_multiple_use_voucher_cannot_reference_manual_voucher_reward()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"IN_STORE"}',
    'MANUAL'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $insert_statement$
        INSERT INTO multiple_use_voucher (
          reward_id,
          has_usage_cap
        ) VALUES (
          %L,
          false
        );
        $insert_statement$,
        test_reward_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;


CREATE FUNCTION public.test_single_use_voucher_can_reference_single_use_reward()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'SINGLE_USE'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT lives_ok(
      FORMAT(
        $insert_statement$
        INSERT INTO single_use_voucher (
          reward_id
        ) VALUES (
          %L
        );
        $insert_statement$,
        test_reward_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_single_use_voucher_cannot_reference_multiple_use_voucher_reward()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'MULTIPLE_USE'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $insert_statement$
        INSERT INTO single_use_voucher (
          reward_id
        ) VALUES (
          %L
        );
        $insert_statement$,
        test_reward_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_single_use_voucher_cannot_reference_on_demand_voucher_reward()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'ON_DEMAND'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $insert_statement$
        INSERT INTO single_use_voucher (
          reward_id
        ) VALUES (
          %L
        );
        $insert_statement$,
        test_reward_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;


CREATE FUNCTION public.test_single_use_voucher_cannot_reference_manual_voucher_reward()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"IN_STORE"}',
    'MANUAL'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $insert_statement$
        INSERT INTO single_use_voucher (
          reward_id
        ) VALUES (
          %L
        );
        $insert_statement$,
        test_reward_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_code_voucher_value_can_only_reference_one_voucher()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_single_use_reward_id UUID;
  test_multiple_use_reward_id UUID;
  test_single_use_voucher_id BIGINT;
  test_multiple_use_voucher_id INT;
  test_voucher_value_id BIGINT;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'SINGLE_USE'
  ) RETURNING id INTO test_single_use_reward_id;

  INSERT INTO single_use_voucher (reward_id) 
  VALUES (test_single_use_reward_id)
  RETURNING id INTO test_single_use_voucher_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'MULTIPLE_USE'
  ) RETURNING id INTO test_multiple_use_reward_id;

  INSERT INTO multiple_use_voucher (
    reward_id,
    has_usage_cap
  ) VALUES (
    test_multiple_use_reward_id,
    false
  ) RETURNING id INTO test_multiple_use_voucher_id;

  INSERT INTO code_based_voucher_value (
    single_use_voucher_id,
    redemption_code
  ) VALUES (
    test_single_use_voucher_id,
    gen_random_uuid()::TEXT
  ) RETURNING id INTO test_voucher_value_id;

  -- Updating multiple_use_voucher_id is ok as long as single_use_voucher_id is set to null
  UPDATE code_based_voucher_value 
  SET single_use_voucher_id = null, multiple_use_voucher_id = test_multiple_use_voucher_id
  WHERE id = test_voucher_value_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $update_statement$
          UPDATE code_based_voucher_value 
          SET single_use_voucher_id = %L 
          WHERE id = %L;
        $update_statement$,
        test_single_use_voucher_id,
        test_voucher_value_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_qr_code_voucher_value_can_only_reference_one_voucher()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_single_use_reward_id UUID;
  test_multiple_use_reward_id UUID;
  test_single_use_voucher_id BIGINT;
  test_multiple_use_voucher_id INT;
  test_voucher_value_id BIGINT;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"IN_STORE"}',
    'SINGLE_USE'
  ) RETURNING id INTO test_single_use_reward_id;

  INSERT INTO single_use_voucher (reward_id) 
  VALUES (test_single_use_reward_id)
  RETURNING id INTO test_single_use_voucher_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"IN_STORE"}',
    'MULTIPLE_USE'
  ) RETURNING id INTO test_multiple_use_reward_id;

  INSERT INTO multiple_use_voucher (
    reward_id,
    has_usage_cap
  ) VALUES (
    test_multiple_use_reward_id,
    false
  ) RETURNING id INTO test_multiple_use_voucher_id;

  INSERT INTO qr_code_based_voucher_value (
    single_use_voucher_id,
    redemption_qr_code
  ) VALUES (
    test_single_use_voucher_id,
    gen_random_uuid()::TEXT
  ) RETURNING id INTO test_voucher_value_id;

  -- Updating multiple_use_voucher_id is ok as long as single_use_voucher_id is set to null
  UPDATE qr_code_based_voucher_value 
  SET single_use_voucher_id = null, multiple_use_voucher_id = test_multiple_use_voucher_id
  WHERE id = test_voucher_value_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $update_statement$
          UPDATE qr_code_based_voucher_value 
          SET single_use_voucher_id = %L 
          WHERE id = %L;
        $update_statement$,
        test_single_use_voucher_id,
        test_voucher_value_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_link_voucher_value_can_only_reference_one_voucher()
RETURNS SETOF TEXT AS $test_function_body$
DECLARE
  test_partner_id INT;
  test_single_use_reward_id UUID;
  test_multiple_use_reward_id UUID;
  test_single_use_voucher_id BIGINT;
  test_multiple_use_voucher_id INT;
  test_voucher_value_id BIGINT;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'SINGLE_USE'
  ) RETURNING id INTO test_single_use_reward_id;

  INSERT INTO single_use_voucher (reward_id) 
  VALUES (test_single_use_reward_id)
  RETURNING id INTO test_single_use_voucher_id;

  INSERT INTO reward (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'MULTIPLE_USE'
  ) RETURNING id INTO test_multiple_use_reward_id;

  INSERT INTO multiple_use_voucher (
    reward_id,
    has_usage_cap
  ) VALUES (
    test_multiple_use_reward_id,
    false
  ) RETURNING id INTO test_multiple_use_voucher_id;

  INSERT INTO link_based_voucher_value (
    single_use_voucher_id
  ) VALUES (
    test_single_use_voucher_id
  ) RETURNING id INTO test_voucher_value_id;

  -- Updating multiple_use_voucher_id is ok as long as single_use_voucher_id is set to null
  UPDATE link_based_voucher_value 
  SET single_use_voucher_id = null, multiple_use_voucher_id = test_multiple_use_voucher_id
  WHERE id = test_voucher_value_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        $update_statement$
          UPDATE link_based_voucher_value 
          SET single_use_voucher_id = %L 
          WHERE id = %L;
        $update_statement$,
        test_single_use_voucher_id,
        test_voucher_value_id
      )
    )
  );
END;
$test_function_body$ LANGUAGE plpgsql;
