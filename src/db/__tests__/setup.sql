CREATE EXTENSION pgtap;

CREATE SCHEMA test_override;

CREATE TABLE test_override.mocked_values (
  mocked_current_timestamp TIMESTAMPTZ NOT NULL
);

INSERT INTO test_override.mocked_values 
(mocked_current_timestamp) VALUES (now());

CREATE OR REPLACE FUNCTION test_override.now() RETURNS TIMESTAMPTZ AS $$
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
