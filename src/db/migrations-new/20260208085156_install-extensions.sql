-- migrate:up
-- Enable geospatial types, functions, etc.
CREATE EXTENSION postgis;

/* 
  btree_gist enables the creation of composite indexes containing 
  geospatial and non-geospatial types. This helps drastically speed up 
  SELECT queries on the locations table as both partner_id and 
  coordinates can be indexed together, yielding very fast results 
  whether one or both of these fields is included in a query's WHERE 
  clause.
*/
CREATE EXTENSION btree_gist;

-- migrate:down
DROP EXTENSION btree_gist;
DROP EXTENSION postgis;

