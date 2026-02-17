CREATE FUNCTION public.test_partner_details_update_trigger() 
RETURNS SETOF TEXT AS $$
DECLARE 
  test_partner_id INT;
  test_language_code CHAR(2) := 'EN';
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN 
INSERT INTO partners DEFAULT VALUES 
RETURNING id INTO test_partner_id;

INSERT INTO languages (language_code, language_name) VALUES (
  test_language_code,
  'English'
);

INSERT INTO partner_details_translations (
  partner_id,
  language_code,
  name,
  logo_url,
  description
) VALUES (
  test_partner_id,
  test_language_code,
  anon.dummy_company_name(),
  testing.dummy_image_url(),
  anon.lorem_ipsum(2)
) RETURNING updated_at INTO original_updated_at;

UPDATE partner_details_translations SET description = anon.lorem_ipsum(3) 
WHERE partner_details_translations.partner_id = test_partner_id AND 
partner_details_translations.language_code = test_language_code
RETURNING updated_at INTO new_updated_at;

RETURN QUERY (
  SELECT ok(
    new_updated_at > original_updated_at,
    'partner_details_translations.updated_at was set when a row was updated.'
  )
);
END;
$$ LANGUAGE plpgsql;