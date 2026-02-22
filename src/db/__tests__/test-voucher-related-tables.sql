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