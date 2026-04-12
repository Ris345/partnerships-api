CREATE FUNCTION public.test_partner_details_translation_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE 
  test_partner_id INT;
  test_language_tag TEXT := 'en';
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN 
INSERT INTO partner DEFAULT VALUES 
RETURNING id INTO test_partner_id;

INSERT INTO language (language_tag, language_name_en, language_name_native) VALUES (
  test_language_tag,
  'English',
  'English'
);

INSERT INTO partner_details_translation (
  partner_id,
  language_tag,
  name,
  logo_url,
  description
) VALUES (
  test_partner_id,
  test_language_tag,
  anon.dummy_company_name(),
  testing.dummy_image_url(),
  anon.lorem_ipsum(2)
) RETURNING updated_at INTO original_updated_at;

UPDATE partner_details_translation SET description = anon.lorem_ipsum(3) 
WHERE partner_details_translation.partner_id = test_partner_id AND 
partner_details_translation.language_tag = test_language_tag
RETURNING updated_at INTO new_updated_at;

RETURN QUERY (
  SELECT ok(
    new_updated_at > original_updated_at,
    'partner_details_translation.updated_at was set when a row was updated.'
  )
);
END;
$$ LANGUAGE plpgsql;