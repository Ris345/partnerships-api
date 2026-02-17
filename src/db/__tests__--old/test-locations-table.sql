CREATE FUNCTION public.test_locations_table_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE
  partner_id INT;
  location_id BIGINT;
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

  INSERT INTO locations (
    partner_id,
    coordinates
  ) VALUES (
    partner_id,
    make_geographic_point(124.43555, -23.98791)
  ) RETURNING id, updated_at INTO location_id, original_updated_at;

  UPDATE locations SET coordinates = make_geographic_point(121.46621, -4.47498)
  WHERE id = location_id RETURNING updated_at INTO new_updated_at;

  RETURN QUERY (
    SELECT ok(
      new_updated_at > original_updated_at, 
      'updated_at was set when row of locations table was modified.'
    )
  );
END;
$$ LANGUAGE plpgsql;