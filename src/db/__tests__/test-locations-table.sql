CREATE FUNCTION public.test_locations_table_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_location_id BIGINT;
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  INSERT INTO partners DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO locations (
    partner_id,
    coordinates
  ) VALUES (
    test_partner_id,
    testing.dummy_geographic_point()
  ) RETURNING id, updated_at INTO test_location_id, original_updated_at;

  UPDATE locations SET coordinates = testing.dummy_geographic_point()
  WHERE id = test_location_id RETURNING updated_at INTO new_updated_at;

  RETURN QUERY (
    SELECT ok(
      new_updated_at > original_updated_at, 
      'locations.updated_at was set when a row was updated.'
    )
  );
END;
$$ LANGUAGE plpgsql;