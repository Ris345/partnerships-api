import { sql } from 'kysely';
import { db } from '../../../db';
import type {
  RewardDetails,
  RewardResolvers,
} from '../../../model/generated/graphql/types';
import { VoucherOwnership } from '../../../model/generated/graphql/types';
import { JsonbObjectBuilder } from '../helpers/jsonb-builder';
import { mapPartnerId, type RewardNode } from '../helpers/mappers';
import {
  earliestExpirationDateExpression,
  hasUsageOrQuantityLimitExpression,
  voucherOwnershipExpression,
} from '../helpers/reward-expressions';
import type { GraphQLContext } from '../helpers/types';

const voucherOwnership: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['voucherOwnership']
> = async parent => {
  if (parent._meta.voucherOwnership) {
    return parent._meta.voucherOwnership;
  }

  const row = await db
    .selectFrom('public.reward as r')
    .select(voucherOwnershipExpression('r').as('voucher_ownership'))
    .where('r.id', '=', parent.id)
    .executeTakeFirstOrThrow();

  return row.voucher_ownership === 'MULTI_USER' ?
      VoucherOwnership.MultiUser
    : VoucherOwnership.SingleUser;
};

const redemptionForums: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['redemptionForums']
> = parent => {
  return parent.redemptionForums;
};

const translatedDetails: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['translatedDetails']
> = async (parent, args) => {
  const jsonBuilder = new JsonbObjectBuilder()
    .add('shortDescription', sql.ref('rdt.short_description'))
    .add('longDescription', sql.ref('rdt.long_description'));

  const detailsRow = await db
    .selectFrom('public.reward_details_translation as rdt')
    .select(jsonBuilder.build<Omit<RewardDetails, 'categories'>>().as('details'))
    .where('rdt.reward_id', '=', parent.id)
    .where('rdt.language_code', '=', args.languageCode)
    .executeTakeFirstOrThrow();

  const categoriesRows = await db
    .selectFrom('public.reward_category as rc')
    .innerJoin('public.category_translation as ct', join =>
      join
        .onRef('ct.category_id', '=', 'rc.category_id')
        .on('ct.language_code', '=', args.languageCode),
    )
    .select('ct.category_name')
    .where('rc.reward_id', '=', parent.id)
    .groupBy('ct.category_name')
    .orderBy('ct.category_name', 'asc')
    .execute();

  return {
    categories: categoriesRows.map(row => row.category_name),
    shortDescription: detailsRow.details.shortDescription,
    longDescription: detailsRow.details.longDescription ?? null,
  } satisfies RewardDetails;
};

const hasUsageOrQuantityLimit: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['hasUsageOrQuantityLimit']
> = async parent => {
  if (parent._meta.hasUsageOrQuantityLimit !== undefined) {
    return parent._meta.hasUsageOrQuantityLimit;
  }

  const row = await db
    .selectFrom('public.reward as r')
    .select(hasUsageOrQuantityLimitExpression('r').as('has_limit'))
    .where('r.id', '=', parent.id)
    .executeTakeFirstOrThrow();

  return row.has_limit;
};

const earliestExpirationDate: NonNullable<
  RewardResolvers<GraphQLContext, RewardNode>['earliestExpirationDate']
> = async (parent, _args, context) => {
  if (parent._meta.earliestExpirationDate !== undefined) {
    return parent._meta.earliestExpirationDate;
  }

  const row = await db
    .selectFrom('public.reward as r')
    .select(earliestExpirationDateExpression(context.timezone, 'r').as('expiration_date'))
    .where('r.id', '=', parent.id)
    .executeTakeFirstOrThrow();

  return row.expiration_date;
};

const partner: NonNullable<RewardResolvers<GraphQLContext, RewardNode>['partner']> = async (
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
