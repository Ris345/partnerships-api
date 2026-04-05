import type { AppResolver } from '../../../model/graphql';

import { sql } from 'kysely';
import { gqlarr } from '../../../model/graphql/generated/types';
import { LocationQueryFactory } from './location-query-factory';

export const location: AppResolver<object> = (
  _parent,
  _args,
  _context,
  info,
) => {
  const locationField = gqlarr.getQueryField(info, 'location')!;

  return LocationQueryFactory.createSelectStatement(locationField.fields)
    .where(
      'id',
      '=',
      sql<bigint>`CAST(${locationField.arguments.id} AS BIGINT)`,
    )
    .executeTakeFirst();
};
