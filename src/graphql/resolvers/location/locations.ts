import type { AppResolver } from '../../../model/graphql';

import { gqlarr } from '../../../model/graphql/generated/types';
import { LocationQueryFactory } from './location-query-factory';
import { clampedOrDefault } from '../../../util/clamped-or-default';

export const locations: AppResolver<object[]> = (
  _parent,
  _args,
  _context,
  info,
) => {
  const locationsField = gqlarr.getQueryField(info, 'locations')!;

  let query = LocationQueryFactory.createSelectStatement(
    locationsField.fields,
  ).where(eb => {
    return LocationQueryFactory.createWhereCondition(
      eb,
      locationsField.arguments.filter,
    );
  });

  if (locationsField.arguments.orderBy) {
    query = LocationQueryFactory.withOrderBy(
      query,
      locationsField.arguments.orderBy,
    );
  }

  query = query.limit(
    clampedOrDefault(locationsField.arguments.take, {
      min: 0,
      max: 50,
      default: 50,
    }),
  );

  return query.execute();
};
