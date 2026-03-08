import { sql } from 'kysely';
import { db, pgFn } from '../../../db';
import type {
  LocationResolvers,
} from '../../../model/generated/graphql/types';
import type { Point } from '../../../model/point';
import { mapPartnerId, type LocationNode } from '../helpers/mappers';
import { distanceUnitsToDbEnum } from '../helpers/query-builders';
import type { GraphQLContext } from '../helpers/types';

const coordinates: NonNullable<LocationResolvers<GraphQLContext, LocationNode>['coordinates']> = (
  parent,
) => {
  return parent.coordinates;
};

const distance: NonNullable<LocationResolvers<GraphQLContext, LocationNode>['distance']> = async (
  parent,
  args,
) => {
  const originPoint = pgFn('public.make_geographic_point', [
    sql.val(args.from.longitude),
    sql.val(args.from.latitude),
  ]);

  const row = await db
    .selectNoFrom([
      pgFn('public.calc_distance_with_units', [
        sql.val(parent._meta.coordinates as Point),
        sql<Point>`${originPoint}::geography`,
        sql.val(distanceUnitsToDbEnum(args.units)),
      ]).as('distance'),
    ])
    .executeTakeFirstOrThrow();

  return row.distance ?? 0;
};

const partner: NonNullable<LocationResolvers<GraphQLContext, LocationNode>['partner']> = async (
  parent,
) => {
  return mapPartnerId(parent._meta.partnerId);
};

/**
 * Location field resolvers.
 */
export const locationResolvers: LocationResolvers<GraphQLContext, LocationNode> = {
  coordinates,
  distance,
  partner,
};
