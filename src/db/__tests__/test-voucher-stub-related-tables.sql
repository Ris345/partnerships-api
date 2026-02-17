CREATE FUNCTION public.test_on_demand_voucher_stubs_can_reference_on_demand_voucher_reward()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
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

  RETURN QUERY (
    SELECT lives_ok(
      FORMAT(
        'INSERT INTO on_demand_voucher_stubs (reward_id) VALUES (%L);',
        test_reward_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_on_demand_voucher_stubs_cannot_reference_multiple_use_voucher_reward()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
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

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        'INSERT INTO on_demand_voucher_stubs (reward_id) VALUES (%L);',
        test_reward_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_on_demand_voucher_stubs_cannot_reference_single_use_voucher_reward()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO rewards (
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
        'INSERT INTO on_demand_voucher_stubs (reward_id) VALUES (%L);',
        test_reward_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_on_demand_voucher_stubs_cannot_reference_manual_voucher_reward()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO rewards (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"ONLINE"}',
    'MANUAL'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        'INSERT INTO on_demand_voucher_stubs (reward_id) VALUES (%L);',
        test_reward_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_manual_voucher_stubs_can_reference_manual_voucher_reward()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO rewards (
    partner_id,
    redemption_forums,
    voucher_type
  ) VALUES (
    test_partner_id,
    '{"IN_STORE"}',
    'MANUAL'
  ) RETURNING id INTO test_reward_id;

  RETURN QUERY (
    SELECT lives_ok(
      FORMAT(
        'INSERT INTO manual_voucher_stubs (reward_id) VALUES (%L);',
        test_reward_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_manual_voucher_stubs_cannot_reference_multiple_use_voucher_reward()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
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

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        'INSERT INTO manual_voucher_stubs (reward_id) VALUES (%L);',
        test_reward_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION public.test_manual_voucher_stubs_cannot_reference_single_use_voucher_reward()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO rewards (
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
        'INSERT INTO manual_voucher_stubs (reward_id) VALUES (%L);',
        test_reward_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION public.test_manual_voucher_stubs_cannot_reference_on_demand_voucher_reward()
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_reward_id UUID;
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

  RETURN QUERY (
    SELECT throws_ok(
      FORMAT(
        'INSERT INTO manual_voucher_stubs (reward_id) VALUES (%L);',
        test_reward_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql;