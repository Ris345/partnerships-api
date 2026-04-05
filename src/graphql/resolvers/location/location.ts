import type { AppContext } from '../../../model/graphql';

import { sql } from 'kysely';
import { gqlarr, QueryLocationResolver } from '../../../model/graphql';
import { LocationRepository } from './location-repository';

export const location: QueryLocationResolver<AppContext> = (
  _parent,
  _args,
  _context,
  info,
) => {
  const locationField = gqlarr.getQueryField(info, 'location')!;

  return LocationRepository.select(locationField.fields)
    .where(
      'id',
      '=',
      sql<bigint>`CAST(${locationField.arguments.id} AS BIGINT)`,
    )
    .executeTakeFirst();
};
