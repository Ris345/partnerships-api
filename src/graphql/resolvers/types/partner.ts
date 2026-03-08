import type { PartnerResolvers } from '../../../model/generated/graphql/types';
import { argsSignature } from '../helpers/args-signature';
import type { GraphQLContext } from '../helpers/types';
import type { PartnerNode } from '../helpers/mappers';

const translatedDetails: NonNullable<
  PartnerResolvers<GraphQLContext, PartnerNode>['translatedDetails']
> = (parent, args) => {
  const details = parent._meta.translatedDetailsByArgs[argsSignature(args)];

  if (!details) {
    throw new Error(
      `Partner translatedDetails not loaded for partner ${parent.id} and args ${JSON.stringify(args)}`,
    );
  }

  return details;
};

const locations: NonNullable<PartnerResolvers<GraphQLContext, PartnerNode>['locations']> = (
  parent,
  args,
) => {
  const value = parent._meta.locationsByArgs[argsSignature(args)];

  if (!value) {
    throw new Error(
      `Partner locations not loaded for partner ${parent.id} and args ${JSON.stringify(args)}`,
    );
  }

  return value;
};

const locationsCount: NonNullable<
  PartnerResolvers<GraphQLContext, PartnerNode>['locationsCount']
> = (parent, args) => {
  const value = parent._meta.locationsCountByArgs[argsSignature(args)];

  if (value === undefined) {
    throw new Error(
      `Partner locationsCount not loaded for partner ${parent.id} and args ${JSON.stringify(args)}`,
    );
  }

  return value;
};

const rewards: NonNullable<PartnerResolvers<GraphQLContext, PartnerNode>['rewards']> = (
  parent,
  args,
) => {
  const value = parent._meta.rewardsByArgs[argsSignature(args)];

  if (!value) {
    throw new Error(
      `Partner rewards not loaded for partner ${parent.id} and args ${JSON.stringify(args)}`,
    );
  }

  return value;
};

const rewardsCount: NonNullable<PartnerResolvers<GraphQLContext, PartnerNode>['rewardsCount']> = (
  parent,
  args,
) => {
  const value = parent._meta.rewardsCountByArgs[argsSignature(args)];

  if (value === undefined) {
    throw new Error(
      `Partner rewardsCount not loaded for partner ${parent.id} and args ${JSON.stringify(args)}`,
    );
  }

  return value;
};

/**
 * Partner field resolvers.
 */
export const partnerResolvers: PartnerResolvers<GraphQLContext, PartnerNode> = {
  translatedDetails,
  locations,
  locationsCount,
  rewards,
  rewardsCount,
};
