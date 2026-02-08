CREATE FUNCTION public.test_partners_table_update_trigger() RETURNS SETOF TEXT AS $$
DECLARE
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  INSERT INTO partners (
    id,
    name,
    logo_url,
    description
  ) VALUES (
    'joes-coffee-shop',
    'Joe''s Coffee Shop',
    '/images/logos/joes-coffee-shop.webp',
    'An coffee shop for programmers'
  ) RETURNING updated_at INTO original_updated_at;

  UPDATE partners 
  SET description = 'An AWESOME coffee shop for programmers' 
  WHERE id = 'joes-coffee-shop'
  RETURNING updated_at INTO new_updated_at;

  RETURN QUERY (
    SELECT ok(
    new_updated_at > original_updated_at, 
    'updated_at was set when row of partners table was modified.'
    )
  );
END;
$$ LANGUAGE plpgsql;