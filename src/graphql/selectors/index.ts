import { sql } from 'kysely';
import { pgFn, db } from '../../db';
import { LocationFields } from '../../model/generated/graphql/types';

// needs to be able to apply filter, order by (joining if necessary)
export function location(fields: LocationFields) {
  return pgFn(
    'pg_catalog.jsonb_build_object',
    fields.map(field => {
      switch (field.name) {
        case '__typename':
          return sql.val('Location');
        case 'id':
          return sql.ref('id'); // need to convert to string
        case 'coordinates':
          return coordinates();
        case 'distance':
          return pgFn('public.calc_distance_with_units', [
            sql.ref('coordinates'),
            sql.val(
              pgFn('public.make_geographic_point', [
                sql.val(field.arguments.from.longitude),
                sql.val(field.arguments.from.latitude),
              ]),
            ) as any,
            sql.val(field.arguments['units']),
          ]);
        default:
          throw new Error();
      }
    }),
  );
}

function coordinates() {
  return sql`select something`;
}
