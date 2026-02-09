CREATE FUNCTION public.test_manual_reward_can_have_manual_voucher_details() 
RETURNS SETOF TEXT AS $test_definition$
DECLARE
  partner_id INT;
  reward_id UUID;
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
  '20% Off At Checkout',
  '{"in_store"}',
  'manual'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT lives_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO manual_voucher_details (
        reward_id,
        instructions
      ) VALUES (
        %L,
        'Show the app to one of our employees so they can '
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_single_use_voucher_reward_voucher_type_cannot_be_multiple_use() 
RETURNS SETOF TEXT AS $test_definition$
DECLARE
  partner_id INT;
  reward_id UUID;
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
  '20% Off At Checkout',
  '{"online", "in_store"}',
  'multiple_use'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT throws_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO single_use_vouchers (
        reward_id,
        redemption_methods,
        instructions,
        redemption_code
      ) VALUES (
        %L,
        '{"code"}',
        'Use this code at checkout for 20%% off',
        gen_random_uuid()::TEXT
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_single_use_voucher_reward_voucher_type_cannot_be_manual() 
RETURNS SETOF TEXT AS $test_definition$
DECLARE
  partner_id INT;
  reward_id UUID;
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
  '20% Off At Checkout',
  '{"online", "in_store"}',
  'manual'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT throws_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO single_use_vouchers (
        reward_id,
        redemption_methods,
        instructions,
        redemption_code
      ) VALUES (
        %L,
        '{"code"}',
        'Use this code at checkout for 20%% off',
        gen_random_uuid()::TEXT
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_single_use_voucher_reward_voucher_type_cannot_be_on_demand() 
RETURNS SETOF TEXT AS $test_definition$
DECLARE
  partner_id INT;
  reward_id UUID;
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
  '20% Off At Checkout',
  '{"online", "in_store"}',
  'on_demand'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT throws_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO single_use_vouchers (
        reward_id,
        redemption_methods,
        instructions,
        redemption_code
      ) VALUES (
        %L,
        '{"code"}',
        'Use this code at checkout for 20%% off',
        gen_random_uuid()::TEXT
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;