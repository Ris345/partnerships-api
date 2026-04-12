CREATE FUNCTION public.test_category_translations_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE 
  test_category_id INT;
  test_language_tag TEXT := 'es';
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN 
INSERT INTO category DEFAULT VALUES RETURNING id INTO test_category_id;
INSERT INTO language (language_tag, language_name_en, language_name_native) VALUES (
  test_language_tag,
  'Spanish',
  'Espagnol'
);

INSERT INTO category_translation (category_id, language_tag, category_name) 
VALUES (test_category_id, test_language_tag, 'Comida y bebida')
RETURNING updated_at INTO original_updated_at;

UPDATE category_translation SET category_name = 'Entretenimiento'
WHERE category_id = test_category_id AND language_tag = test_language_tag 
RETURNING updated_at INTO new_updated_at;

RETURN QUERY (
  SELECT ok(
    new_updated_at > original_updated_at,
    'category_translation.updated_at was set when a row was updated.'
  )
);
END;
$$ LANGUAGE plpgsql;