CREATE FUNCTION public.test_partners_table_update_trigger() RETURNS SETOF TEXT AS $$
DECLARE
  partner_id INT;
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
  ) RETURNING id, updated_at INTO partner_id, original_updated_at;

  UPDATE partners 
  SET description = 'An AWESOME coffee shop for programmers' 
  WHERE id = partner_id
  RETURNING updated_at INTO new_updated_at;

  RETURN QUERY (
    SELECT ok(
    new_updated_at > original_updated_at, 
    'updated_at was set when row of partners table was modified.'
    )
  );
END;
$$ LANGUAGE plpgsql;