-- migrate:up
CREATE TABLE location (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  partner_id INT NOT NULL REFERENCES partner(id) ON DELETE CASCADE,
  coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
  UNIQUE (partner_id, coordinates)
) INHERITS (base_entity);

COMMENT ON TABLE location IS '@introspeql-include';

CREATE TRIGGER location_update_trigger 
BEFORE UPDATE ON location
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

/*
  Order matters here. The index performs better when partner_id is specified 
  first.
*/
CREATE INDEX location_partner_id_coordinates_idx 
ON location USING GIST(partner_id, coordinates);

-- migrate:down
DROP TABLE location;
