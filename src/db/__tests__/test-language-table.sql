CREATE FUNCTION public.test_language_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE 
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN 
DECLARE 
  test_language_tag TEXT := 'en';
INSERT INTO language (language_tag, language_name_en, language_name_native) VALUES (
  test_language_tag, 'English', ''
) RETURNING updated_at INTO original_updated_at;

UPDATE language SET language_name_native = 'English'
WHERE language_tag = test_language_tag
RETURNING updated_at INTO new_updated_at;

RETURN QUERY (
  SELECT ok(
    new_updated_at > original_updated_at,
    'language.updated_at was set when a row was updated.'
  )
);
END;
$$ LANGUAGE plpgsql;