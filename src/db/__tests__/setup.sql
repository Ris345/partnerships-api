CREATE EXTENSION pgtap;
CREATE EXTENSION anon;
SELECT anon.init();

CREATE SCHEMA testing;

CREATE TABLE testing.mocked_values (
  mocked_current_timestamp TIMESTAMPTZ NOT NULL
);

INSERT INTO testing.mocked_values 
(mocked_current_timestamp) VALUES (now());

/*
  Mock now() so that each time it is called, the returned value is advanced by
  one hour.
*/
CREATE OR REPLACE FUNCTION testing.now() RETURNS TIMESTAMPTZ AS $$
DECLARE
  t TIMESTAMPTZ;
BEGIN
  UPDATE mocked_values SET mocked_current_timestamp = 
  (SELECT mocked_current_timestamp FROM mocked_values LIMIT 1) 
  + INTERVAL '1 hour'
  RETURNING mocked_current_timestamp INTO t;

  RETURN t;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION testing.dummy_web_address() RETURNS TEXT AS $$
BEGIN
  RETURN CONCAT(
    'https://', 
    anon.dummy_word(), 
    '.', 
    anon.dummy_domain_suffix()
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION testing.dummy_image_url() RETURNS TEXT AS $$
  BEGIN 
    RETURN CONCAT(testing.dummy_web_address(), anon.dummy_file_path());
  END;
$$ LANGUAGE plpgsql;

/* 
  Similar dummy_latitude/dummy_longitude functions are exposed by anon, but 
  the dummy_longitude function can produce values greater than 180, hence these 
  replacements.
*/
CREATE OR REPLACE FUNCTION testing.dummy_latitude() 
RETURNS DOUBLE PRECISION AS $$
BEGIN
  RETURN random() * 180 - 90;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION testing.dummy_longitude() 
RETURNS DOUBLE PRECISION AS $$
BEGIN
  RETURN random() * 360 - 180;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION testing.dummy_geographic_point() 
RETURNS GEOGRAPHY (POINT, 4326) AS $$
  BEGIN
    RETURN make_geographic_point(
      testing.dummy_longitude()::DOUBLE PRECISION,
      testing.dummy_latitude()::DOUBLE PRECISION
    );
  END;
$$ LANGUAGE plpgsql;
