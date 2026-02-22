CREATE FUNCTION public.test_language_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE 
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN 
INSERT INTO language (language_code, language_name) VALUES (
  'EN',
  'Anglais'
) RETURNING updated_at INTO original_updated_at;

UPDATE language SET language_name = 'English'
WHERE language_code = 'EN' 
RETURNING updated_at INTO new_updated_at;

RETURN QUERY (
  SELECT ok(
    new_updated_at > original_updated_at,
    'language.updated_at was set when a row was updated.'
  )
);
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.test_language_code_must_be_uppercase() 
RETURNS SETOF TEXT AS $test_function_body$
BEGIN
RETURN QUERY (
  SELECT throws_ok(
    $insert_statement$
      INSERT INTO language (language_code, language_name) VALUES (
        'fr',
        'French'
      );
    $insert_statement$
  )
);
END;
$test_function_body$ LANGUAGE plpgsql;