-- migrate:up
CREATE TABLE locations (
  id BIGSERIAL PRIMARY KEY,
  partner_id INT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE locations IS $$
Physical locations of partners. Each partner may have zero to many locations.

@introspeql-include
$$;

CREATE TRIGGER locations_update_trigger 
BEFORE UPDATE ON locations 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

/*
  Order matters here. The index performs better when partner_id is specified 
  first.
*/
CREATE INDEX locations_partner_id_coordinates_idx 
ON locations USING GIST(partner_id, coordinates);

-- migrate:down
DROP TABLE locations;
