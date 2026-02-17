CREATE FUNCTION public.test_smoke_test() 
RETURNS SETOF TEXT AS $$
BEGIN
RETURN QUERY (
  SELECT pass('tests pass')
);
END;
$$ LANGUAGE plpgsql;