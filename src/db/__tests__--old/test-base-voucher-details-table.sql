CREATE FUNCTION public.test_base_voucher_details_table_does_not_allow_insertions() 
RETURNS SETOF TEXT AS $test_definition$
BEGIN
RETURN QUERY (
  SELECT throws_ok(
    $insert_definition$
      INSERT INTO base_voucher_details (
        redeemable_until
      ) VALUES (
        NOW() + INTERVAL '1 year'
      );
    $insert_definition$
  )
);
END;
$test_definition$ LANGUAGE plpgsql;