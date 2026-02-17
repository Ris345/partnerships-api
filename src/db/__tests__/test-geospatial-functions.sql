CREATE FUNCTION public.test_convert_meters_to_kilometers()
RETURNS SETOF TEXT AS $$
BEGIN
  RETURN QUERY (
    SELECT ok(
      convert_distance(
        distance => 1000, from_units => 'METERS', to_units => 'KILOMETERS'
      ) = 1,
      'convert_distance converts meters to kilometers.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_convert_kilometers_to_meters()
RETURNS SETOF TEXT AS $$
BEGIN
  RETURN QUERY (
    SELECT ok(
      convert_distance(
        distance => 1, from_units => 'KILOMETERS', to_units => 'METERS'
      ) = 1000,
      'convert_distance converts kilometers to meters.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_convert_meters_to_miles()
RETURNS SETOF TEXT AS $$
BEGIN
  RETURN QUERY (
    SELECT ok(
      convert_distance(
        distance => 1609.344, from_units => 'METERS', to_units => 'MILES'
      ) = 1,
      'convert_distance converts meters to miles.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_convert_miles_to_meters()
RETURNS SETOF TEXT AS $$
BEGIN
  RETURN QUERY (
    SELECT ok(
      convert_distance(
        distance => 1, from_units => 'MILES', to_units => 'METERS'
      ) = 1609.344,
      'convert_distance converts miles to meters.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_convert_kilometers_to_miles()
RETURNS SETOF TEXT AS $$
BEGIN
  RETURN QUERY (
    SELECT ok(
      convert_distance(
        distance => 1.609344, from_units => 'KILOMETERS', to_units => 'MILES'
      ) = 1,
      'convert_distance converts kilometers to miles.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_convert_miles_to_kilometers()
RETURNS SETOF TEXT AS $$
BEGIN
  RETURN QUERY (
    SELECT ok(
      convert_distance(
        distance => 1, from_units => 'MILES', to_units => 'KILOMETERS'
      ) = 1.609344,
      'convert_distance converts miles to kilometers.'
    )
  );
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION public.test_get_latitude_returns_latitude()
RETURNS SETOF TEXT AS $$
DECLARE 
  latitude DOUBLE PRECISION := testing.dummy_latitude()::DOUBLE PRECISION;
  test_point GEOGRAPHY(POINT, 4326) := make_geographic_point(
    latitude => latitude,
    longitude => testing.dummy_longitude()::DOUBLE PRECISION
  );
BEGIN

  RETURN QUERY (
    SELECT ok(
      get_latitude(test_point) = latitude,
      'get_latitude returns the correct latitude for a given point.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_get_latitude_returns_correct_latitude_at_lower_bound()
RETURNS SETOF TEXT AS $$
DECLARE 
  latitude DOUBLE PRECISION := -90;
  test_point GEOGRAPHY(POINT, 4326) := make_geographic_point(
    latitude => latitude,
    longitude => testing.dummy_longitude()::DOUBLE PRECISION
  );
BEGIN

  RETURN QUERY (
    SELECT ok(
      get_latitude(test_point) = latitude,
      'get_latitude returns the correct latitude at -90 deg.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_get_latitude_returns_correct_latitude_at_upper_bound()
RETURNS SETOF TEXT AS $$
DECLARE 
  latitude DOUBLE PRECISION := 90;
  test_point GEOGRAPHY(POINT, 4326) := make_geographic_point(
    latitude => latitude,
    longitude => testing.dummy_longitude()::DOUBLE PRECISION
  );
BEGIN

  RETURN QUERY (
    SELECT ok(
      get_latitude(test_point) = latitude,
      'get_latitude returns the correct latitude at 90 deg.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_get_longitude_returns_longitude()
RETURNS SETOF TEXT AS $$
DECLARE 
  longitude DOUBLE PRECISION := testing.dummy_longitude()::DOUBLE PRECISION;
  test_point GEOGRAPHY(POINT, 4326) := make_geographic_point(
    latitude => testing.dummy_latitude()::DOUBLE PRECISION,
    longitude => longitude
  );
BEGIN

  RETURN QUERY (
    SELECT ok(
      get_longitude(test_point) = longitude,
      'get_longitude returns the correct longitude for a given point.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_get_longitude_returns_correct_longitude_at_lower_bound()
RETURNS SETOF TEXT AS $$
DECLARE 
  longitude DOUBLE PRECISION := -180;
  test_point GEOGRAPHY(POINT, 4326) := make_geographic_point(
    latitude => testing.dummy_latitude()::DOUBLE PRECISION,
    longitude => longitude
  );
BEGIN

  RETURN QUERY (
    SELECT ok(
      get_longitude(test_point) = longitude,
      'get_longitude returns the correct longitude at -180 deg.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_get_longitude_returns_correct_longitude_at_upper_bound()
RETURNS SETOF TEXT AS $$
DECLARE 
  longitude DOUBLE PRECISION := 180;
  test_point GEOGRAPHY(POINT, 4326) := make_geographic_point(
    latitude => testing.dummy_latitude()::DOUBLE PRECISION,
    longitude => longitude
  );
BEGIN

  RETURN QUERY (
    SELECT ok(
      get_longitude(test_point) = longitude,
      'get_longitude returns the correct longitude at 180 deg.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_calc_distance_with_units_returns_distance_in_meters()
RETURNS SETOF TEXT AS $$
DECLARE
  distance_in_meters FLOAT := 1000;
  origin GEOGRAPHY(POINT, 4326) := testing.dummy_geographic_point();
  destination GEOGRAPHY(POINT, 4326) := ST_Project(
    origin,
    distance_in_meters,
    radians(random() * 360)
  );
BEGIN
  RETURN QUERY (
    SELECT ok(
      calc_distance_with_units(
        origin,
        destination,
        'METERS'
      ) = distance_in_meters,
      'calc_distance_with_units returns the correct distance in meters.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_calc_distance_with_units_returns_distance_in_kilometers()
RETURNS SETOF TEXT AS $$
DECLARE
  distance_in_kilometers FLOAT := 1;
  distance_in_meters FLOAT := distance_in_kilometers * 1000;
  origin GEOGRAPHY(POINT, 4326) := testing.dummy_geographic_point();
  destination GEOGRAPHY(POINT, 4326) := ST_Project(
    origin,
    distance_in_meters,
    radians(random() * 360)
  );
BEGIN
  RETURN QUERY (
    SELECT ok(
      calc_distance_with_units(
        origin,
        destination,
        'KILOMETERS'
      ) = distance_in_kilometers,
      'calc_distance_with_units returns the correct distance in kilometers.'
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_calc_distance_with_units_returns_distance_in_miles()
RETURNS SETOF TEXT AS $$
DECLARE
  distance_in_miles FLOAT := 1;
  distance_in_meters FLOAT := distance_in_miles * 1609.344;
  origin GEOGRAPHY(POINT, 4326) := testing.dummy_geographic_point();
  destination GEOGRAPHY(POINT, 4326) := ST_Project(
    origin,
    distance_in_meters,
    radians(random() * 360)
  );
BEGIN
  RETURN QUERY (
    SELECT ok(
      calc_distance_with_units(
        origin,
        destination,
        'MILES'
      ) = distance_in_miles,
      'calc_distance_with_units returns the correct distance in miles.'
    )
  );
END;
$$ LANGUAGE plpgsql;
