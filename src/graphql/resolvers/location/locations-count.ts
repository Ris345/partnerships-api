import type { AppResolver } from '../../../model/graphql';

import { sql } from 'kysely';
import { gqlarr } from '../../../model/graphql/generated/types';
import { LocationQueryFactory } from './location-query-factory';

export const locationsCount: AppResolver<number> = async (
  _parent,
  _args,
  _context,
  info,
) => {
  let query = LocationQueryFactory.createCountStatement();

  const {
    arguments: { filter },
  } = gqlarr.getQueryField(info, 'locationsCount')!;

  if (filter) {
    query = query.where(eb =>
      LocationQueryFactory.createWhereCondition(eb, filter),
    );
  }

  const result = await query.executeTakeFirstOrThrow();
  return Number(result.locations_count); // going to have to add support for bigint scalars
};
