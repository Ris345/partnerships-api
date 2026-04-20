-- migrate:up
CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
	RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION row_exists(
  table_name TEXT,
  column_name TEXT,
  search_value ANYELEMENT,
  OUT result BOOLEAN
) AS $$
BEGIN
  EXECUTE FORMAT(
    'SELECT EXISTS (SELECT 1 FROM %I WHERE %I = %L)',
    table_name,
    column_name,
    search_value
  ) INTO result;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION contains_duplicates(arr ANYARRAY) RETURNS BOOLEAN AS $$
  BEGIN
    RETURN array_sort(ARRAY(SELECT DISTINCT UNNEST(arr))) != array_sort(arr);
  END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION to_uppercase_array(arr TEXT[]) RETURNS TEXT[] AS $$
  BEGIN
    RETURN ARRAY(SELECT UPPER(UNNEST(arr)));
  END;
$$ LANGUAGE plpgsql;

-- migrate:down
DROP FUNCTION to_uppercase_array;
DROP FUNCTION contains_duplicates;
DROP FUNCTION row_exists;
DROP FUNCTION set_updated_at;
