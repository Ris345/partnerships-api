import type { LocationResolvers } from '../../../model/generated/graphql/types';
import { argsSignature } from '../helpers/args-signature';
import { mapPartnerId, type LocationNode } from '../helpers/mappers';
import type { GraphQLContext } from '../helpers/types';

const coordinates: NonNullable<LocationResolvers<GraphQLContext, LocationNode>['coordinates']> = (
  parent,
) => {
  return parent.coordinates;
};

const distance: NonNullable<LocationResolvers<GraphQLContext, LocationNode>['distance']> = (
  parent,
  args,
) => {
  const value = parent._meta.distanceByArgs[argsSignature(args)];

  if (value === undefined) {
    throw new Error(
      `Location distance not loaded for location ${parent.id} and args ${JSON.stringify(args)}`,
    );
  }

  return value;
};

const partner: NonNullable<LocationResolvers<GraphQLContext, LocationNode>['partner']> = (
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
