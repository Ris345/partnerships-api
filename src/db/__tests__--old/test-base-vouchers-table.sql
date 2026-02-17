CREATE FUNCTION public.test_base_vouchers_table_does_not_allow_insertions() 
RETURNS SETOF TEXT AS $test_definition$
BEGIN
RETURN QUERY (
  SELECT throws_ok(
    $insert_definition$
      INSERT INTO base_vouchers (
        redemption_methods,
        instructions,
        redemption_code
      ) VALUES (
        '{"code"}',
        'Use this code at checkout for 20% off',
        gen_random_uuid()::TEXT
      );
    $insert_definition$
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_inserting_code_type_voucher_is_ok_with_code()
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
  '{"online"}',
  'multiple_use'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT lives_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO multiple_use_vouchers (
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

CREATE FUNCTION public.test_inserting_code_type_voucher_throws_without_code()
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
  '{"online"}',
  'multiple_use'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT throws_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO multiple_use_vouchers (
        reward_id,
        redemption_methods,
        instructions
      ) VALUES (
        %L,
        '{"code"}',
        'Use this code at checkout for 20%% off'
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_inserting_non_code_type_voucher_throws_with_code()
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
  'multiple_use'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT throws_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO multiple_use_vouchers (
        reward_id,
        redemption_methods,
        instructions,
        redemption_qr_code,
        redemption_code
      ) VALUES (
        %L,
        '{"qr_code"}',
        'Use this qr code at checkout for 20%% off',
        gen_random_uuid()::TEXT,
        gen_random_uuid()::TEXT
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

--
CREATE FUNCTION public.test_inserting_qr_code_type_voucher_is_ok_with_qr_code()
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
  'multiple_use'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT lives_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO multiple_use_vouchers (
        reward_id,
        redemption_methods,
        instructions,
        redemption_qr_code
      ) VALUES (
        %L,
        '{"qr_code"}',
        'Scan this qr code at checkout for 20%% off',
        gen_random_uuid()::TEXT
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_inserting_qr_code_type_voucher_throws_without_qr_code()
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
  'multiple_use'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT throws_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO multiple_use_vouchers (
        reward_id,
        redemption_methods,
        instructions
      ) VALUES (
        %L,
        '{"qr_code"}',
        'Use this code at checkout for 20%% off'
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_inserting_non_qr_code_type_voucher_throws_with_qr_code()
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
  '{"online"}',
  'multiple_use'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT throws_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO multiple_use_vouchers (
        reward_id,
        redemption_methods,
        instructions,
        redemption_code,
        redemption_qr_code
      ) VALUES (
        %L,
        '{"code"}',
        'Use this code at checkout for 20%% off',
        gen_random_uuid()::TEXT,
        gen_random_uuid()::TEXT
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

-- 
CREATE FUNCTION public.test_inserting_link_type_voucher_is_ok_with_link()
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
  '{"online"}',
  'multiple_use'
) RETURNING id INTO reward_id;

RETURN QUERY (
  SELECT lives_ok(
    FORMAT(
      $insert_definition$
      INSERT INTO multiple_use_vouchers (
        reward_id,
        redemption_methods,
        instructions,
        redemption_link_url
      ) VALUES (
        %L,
        '{"link"}',
        'Use this link for 20%% off',
        'https://joes-coffee-shop.org/shop?promo=20-percent-off'
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_inserting_link_type_voucher_throws_without_link()
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
      INSERT INTO multiple_use_vouchers (
        reward_id,
        redemption_methods,
        instructions
      ) VALUES (
        %L,
        '{"link"}',
        'Use this link for 20%% off'
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_inserting_non_link_voucher_throws_with_link()
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
      INSERT INTO multiple_use_vouchers (
        reward_id,
        redemption_methods,
        instructions,
        redemption_code,
        redemption_link_url
      ) VALUES (
        %L,
        '{"code"}',
        'Use this code at checkout for 20%% off',
        gen_random_uuid()::TEXT,
        'https://joes-coffee-shop.org/shop?promo=20-percent-off'
      );
      $insert_definition$,
      reward_id
    )
  )
);
END;
$test_definition$ LANGUAGE plpgsql;