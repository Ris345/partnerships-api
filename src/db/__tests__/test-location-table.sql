CREATE FUNCTION public.test_location_table_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE
  test_partner_id INT;
  test_location_id BIGINT;
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  INSERT INTO partner DEFAULT VALUES RETURNING id INTO test_partner_id;

  INSERT INTO location (
    partner_id,
    coordinates
  ) VALUES (
    test_partner_id,
    testing.dummy_geographic_point()
  ) RETURNING id, updated_at INTO test_location_id, original_updated_at;

  UPDATE location SET coordinates = testing.dummy_geographic_point()
  WHERE id = test_location_id RETURNING updated_at INTO new_updated_at;

  RETURN QUERY (
    SELECT ok(
      new_updated_at > original_updated_at, 
      'location.updated_at was set when a row was updated.'
    )
  );
END;
$$ LANGUAGE plpgsql;