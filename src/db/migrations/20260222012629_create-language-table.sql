-- migrate:up
CREATE TABLE language (
  language_tag TEXT PRIMARY KEY,
  language_name_en VARCHAR(255) NOT NULL,
  language_name_native VARCHAR(255) NOT NULL
  -- Validate that the language tag confirms to BCP 47 structure as outlined in RFC 5646
  CONSTRAINT language_tag_is_bcp_47 CHECK (
    language_tag ~* '^((?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((?:([A-Za-z]{2,3}(?:-(?:[A-Za-z]{3})){0,3})?|[A-Za-z]{4}|[A-Za-z]{5,8})(?:-(?:[A-Za-z]{4}))?(?:-(?:[A-Za-z]{2}|[0-9]{3}))?(?:-(?:[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(?:-(?:[0-9A-WY-Za-wy-z](?:-[A-Za-z0-9]{2,8})+))*(?:-(x(?:-[A-Za-z0-9]{1,8})+))?)|(?:x(?:-[A-Za-z0-9]{1,8})+))$'
  )
) INHERITS (base_entity);

COMMENT ON TABLE language IS '@introspeql-include';

COMMENT ON COLUMN language.language_name_en
IS 'The name of the language in English.';

COMMENT ON COLUMN language.language_name_native 
IS 'The native name of the language.';

CREATE TRIGGER language_update_trigger
BEFORE UPDATE ON language
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- migrate:down
DROP TABLE language;