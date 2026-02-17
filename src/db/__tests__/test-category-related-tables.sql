CREATE FUNCTION public.test_category_translations_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE 
  test_category_id INT;
  test_language_code CHAR(2) := 'ES';
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN 
INSERT INTO categories DEFAULT VALUES RETURNING id INTO test_category_id;
INSERT INTO languages (language_code, language_name) VALUES (
  test_language_code,
  'Spanish'
);

INSERT INTO category_translations (category_id, language_code, category_name) 
VALUES (test_category_id, test_language_code, 'Comida y bebida')
RETURNING updated_at INTO original_updated_at;

UPDATE category_translations SET category_name = 'Entretenimiento'
WHERE category_id = test_category_id AND language_code = test_language_code 
RETURNING updated_at INTO new_updated_at;

RETURN QUERY (
  SELECT ok(
    new_updated_at > original_updated_at,
    'category_translations.updated_at was set when a row was updated.'
  )
);
END;
$$ LANGUAGE plpgsql;