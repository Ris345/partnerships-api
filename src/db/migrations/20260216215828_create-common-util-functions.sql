-- migrate:up
CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
	RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION sort_arr(arr ANYARRAY) RETURNS ANYARRAY AS $$
  BEGIN 
    RETURN ARRAY(SELECT UNNEST(arr) ORDER BY 1);
  END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION contains_duplicates(arr ANYARRAY) RETURNS BOOLEAN AS $$
  BEGIN
    RETURN sort_arr(ARRAY(SELECT DISTINCT UNNEST(arr))) != sort_arr(arr);
  END;
$$ LANGUAGE plpgsql;

-- migrate:down
DROP FUNCTION contains_duplicates;
DROP FUNCTION sort_arr;
DROP FUNCTION set_updated_at;

