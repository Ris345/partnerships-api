import { sql } from 'kysely';
import { pgFn } from '../../../model/db/generated/types';
import { LocationFields } from '../../../model/graphql/generated/types';

// needs to be able to apply filter, order by (joining if necessary)
export function location(fields: LocationFields) {
  return pgFn(
    'pg_catalog.jsonb_build_object',
    fields.flatMap(field => {
      switch (field.name) {
        case '__typename':
          return [sql.val(field.alias), sql.val('Location')];
        case 'id':
          return [sql.val(field.alias), sql.ref('id')];
        case 'distance':
          return [
            sql.val(field.alias),
            pgFn('public.calc_distance_with_units', [
              sql.ref('coordinates'),
              sql.val(
                pgFn('public.make_geographic_point', [
                  sql.val(field.arguments.from.longitude),
                  sql.val(field.arguments.from.latitude),
                ]),
              ) as any,
              sql.val(field.arguments['units']),
            ]),
          ];
        default:
          throw new Error();
      }
    }),
  );
}
