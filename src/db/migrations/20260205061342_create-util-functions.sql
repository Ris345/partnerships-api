-- migrate:up
CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
	RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION set_updated_at IS $$
A utility function that can be called within a trigger to set the updated_at
column of a row when it receives updates.
$$;

CREATE FUNCTION contains_duplicates(arr ANYARRAY) RETURNS BOOLEAN AS $$
  BEGIN
    RETURN ARRAY(SELECT DISTINCT UNNEST(arr)) != arr;
  END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION contains_duplicates IS $$
A utility function that will return true if an array contains more than one 
copy of any of its values. Useful in CHECK statements, etc.
$$;

-- migrate:down
DROP FUNCTION contains_duplicates;
DROP FUNCTION set_updated_at;

