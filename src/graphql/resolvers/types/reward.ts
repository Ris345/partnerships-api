import type {
  RewardResolvers,
} from '../../../model/generated/graphql/types';
import { argsSignature } from '../helpers/args-signature';
import { mapPartnerId, type RewardNode } from '../helpers/mappers';
import type { GraphQLContext } from '../helpers/types';

const voucherOwnership: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['voucherOwnership']
> = parent => {
  return parent.voucherOwnership;
};

const redemptionForums: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['redemptionForums']
> = parent => {
  return parent.redemptionForums;
};

const translatedDetails: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['translatedDetails']
> = (parent, args) => {
  const details = parent._meta.translatedDetailsByArgs[argsSignature(args)];

  if (!details) {
    throw new Error(
      `Reward translatedDetails not loaded for reward ${parent.id} and args ${JSON.stringify(args)}`,
    );
  }

  return details;
};

const hasUsageOrQuantityLimit: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['hasUsageOrQuantityLimit']
> = parent => {
  return parent.hasUsageOrQuantityLimit;
};

const earliestExpirationDate: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['earliestExpirationDate']
> = parent => {
  return parent.earliestExpirationDate;
};

const partner: NonNullable<RewardResolvers<GraphQLContext, RewardNode>['partner']> = (
  parent,
) => {
  return mapPartnerId(parent._meta.partnerId);
};

/**
 * Reward field resolvers.
 */
export const rewardResolvers: RewardResolvers<GraphQLContext, RewardNode> = {
  voucherOwnership,
  redemptionForums,
  translatedDetails,
  hasUsageOrQuantityLimit,
  earliestExpirationDate,
  partner,
};
