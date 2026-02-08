CREATE FUNCTION public.test_redemption_methods_must_not_be_empty() 
RETURNS SETOF TEXT AS $test_definition$
DECLARE
  partner_id INT;
BEGIN
  INSERT INTO partners (
    name,
    logo_url,
    description
  ) VALUES (
    'Joe''s Coffee Shop',
    '/images/logos/joes-coffee-shop.webp',
    'An coffee shop for programmers'
  ) RETURNING id INTO partner_id;

  RETURN QUERY (
    SELECT throws_ok(
      $insert_definition$
      INSERT INTO rewards (
          id,
          partner_id,
          short_description,
          redemption_forums,
          voucher_type
        ) VALUES (
          gen_random_uuid(),
          partner_id,
          'Free caffe latte',
          '{}',
          'multiple_use'
        );
      $insert_definition$
    )
  );
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_redemption_methods_must_not_contain_duplicates() 
RETURNS SETOF TEXT AS $test_definition$
DECLARE
  partner_id INT;
BEGIN
  INSERT INTO partners (
    name,
    logo_url,
    description
  ) VALUES (
    'Joe''s Coffee Shop',
    '/images/logos/joes-coffee-shop.webp',
    'An coffee shop for programmers'
  ) RETURNING id INTO partner_id;

  RETURN QUERY (
    SELECT throws_ok(
      $insert_definition$
      INSERT INTO rewards (
          id,
          partner_id,
          short_description,
          redemption_forums,
          voucher_type
        ) VALUES (
          gen_random_uuid(),
          partner_id,
          'Free caffe latte',
          '{"online", "online"}',
          'multiple_use'
        );
      $insert_definition$
    )
  );
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_rewards_table_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE
  partner_id INT;
  reward_id UUID;
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  INSERT INTO partners (
    name,
    logo_url,
    description
  ) VALUES (
    'Joe''s Coffee Shop',
    '/images/logos/joes-coffee-shop.webp',
    'An coffee shop for programmers'
  ) RETURNING id INTO partner_id;

  INSERT INTO rewards (
    id,
    partner_id,
    short_description,
    redemption_forums,
    voucher_type
  ) VALUES (
    gen_random_uuid(),
    partner_id,
    'Free caffe latte',
    '{"online", "in_store"}',
    'multiple_use'
  ) RETURNING id, updated_at INTO reward_id, original_updated_at;

  UPDATE rewards SET short_description = 'Free caffe mocha'
  WHERE id = reward_id
  RETURNING updated_at INTO new_updated_at;

  RETURN QUERY (
    SELECT ok(
    new_updated_at > original_updated_at, 
    'updated_at was set when row of rewards table was modified.'
    )
  );
END;
$$ LANGUAGE plpgsql;
