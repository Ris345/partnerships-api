import { sql } from 'kysely';
import type { GraphQLResolveInfo } from 'graphql';
import { db } from '../../../db';
import type {
  QueryResolvers,
  QueryRewardArgs,
  RewardFilter,
  RewardOrderByCriteria,
  VoucherOwnership,
} from '../../../model/generated/graphql/types';
import { getSelectedFieldNames } from '../helpers/graphql-info';
import {
  mapLocationRow,
  mapPartnerId,
  mapRewardRow,
  type RewardNode,
} from '../helpers/mappers';
import {
  applyLocationFilter,
  applyLocationOrderBy,
  applyPartnerFilter,
  applyPartnerOrderBy,
  applyRewardFilter,
  applyRewardOrderBy,
  normalizeTake,
} from '../helpers/query-builders';
import {
  earliestExpirationDateExpression,
  hasUsageOrQuantityLimitExpression,
  voucherOwnershipExpression,
} from '../helpers/reward-expressions';
import type { GraphQLContext } from '../helpers/types';

type RewardQueryRow = {
  id: string;
  partner_id: number;
  redemption_forums: ('ONLINE' | 'IN_STORE')[];
  voucher_type: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL';
  earliest_expiration_date?: Date | null;
  has_usage_or_quantity_limit?: boolean;
  voucher_ownership?: VoucherOwnership;
};

const partner: NonNullable<QueryResolvers<GraphQLContext>['partner']> = async (
  _parent,
  args,
) => {
  const parsedId = toIntId(args.id);
  if (parsedId == null) {
    return null;
  }

  const row = await db
    .selectFrom('public.partner as p')
    .select('p.id')
    .where('p.id', '=', parsedId)
    .executeTakeFirst();

  if (!row) {
    return null;
  }

  return mapPartnerId(row.id);
};

const partners: NonNullable<QueryResolvers<GraphQLContext>['partners']> = async (
  _parent,
  args,
  context,
) => {
  let query = db.selectFrom('public.partner as p').select('p.id');

  query = applyPartnerFilter(query, args.filter, 'p', context.timezone);
  query = applyPartnerOrderBy(query, args.orderBy);

  const rows = await query.limit(normalizeTake(args.take)).execute();
  return rows.map(row => mapPartnerId(row.id));
};

const partnersCount: NonNullable<QueryResolvers<GraphQLContext>['partnersCount']> = async (
  _parent,
  args,
  context,
) => {
  let query = db
    .selectFrom('public.partner as p')
    .select(sql<number>`count(*)::int`.as('count'));

  query = applyPartnerFilter(query, args.filter, 'p', context.timezone);

  const row = await query.executeTakeFirstOrThrow();
  return row.count;
};

const location: NonNullable<QueryResolvers<GraphQLContext>['location']> = async (
  _parent,
  args,
) => {
  const row = await db
    .selectFrom('public.location as l')
    .select(['l.id', 'l.partner_id', 'l.coordinates'])
    .where('l.id', '=', args.id)
    .executeTakeFirst();

  if (!row) {
    return null;
  }

  return mapLocationRow(row);
};

const locations: NonNullable<QueryResolvers<GraphQLContext>['locations']> = async (
  _parent,
  args,
  context,
) => {
  let query = db
    .selectFrom('public.location as l')
    .leftJoin(
      'public.partner as p_for_location_order',
      'p_for_location_order.id',
      'l.partner_id',
    )
    .select(['l.id', 'l.partner_id', 'l.coordinates']);

  query = applyLocationFilter(query, args.filter, 'l', context.timezone);
  query = applyLocationOrderBy(query, args.orderBy, 'l');

  const rows = await query.limit(normalizeTake(args.take)).execute();
  return rows.map(row => mapLocationRow(row));
};

const locationsCount: NonNullable<QueryResolvers<GraphQLContext>['locationsCount']> = async (
  _parent,
  args,
  context,
) => {
  let query = db
    .selectFrom('public.location as l')
    .select(sql<number>`count(*)::int`.as('count'));

  query = applyLocationFilter(query, args.filter, 'l', context.timezone);

  const row = await query.executeTakeFirstOrThrow();
  return row.count;
};

const reward: NonNullable<QueryResolvers<GraphQLContext>['reward']> = async (
  _parent,
  args,
  context,
  info,
) => {
  const rows = await fetchRewards(
    context.timezone,
    info,
    { id: { _eq: (args as QueryRewardArgs).id } } as RewardFilter,
    null,
    1,
  );

  return rows[0] ?? null;
};

const rewards: NonNullable<QueryResolvers<GraphQLContext>['rewards']> = async (
  _parent,
  args,
  context,
  info,
) => {
  return fetchRewards(
    context.timezone,
    info,
    args.filter,
    args.orderBy,
    normalizeTake(args.take),
  );
};

const rewardsCount: NonNullable<QueryResolvers<GraphQLContext>['rewardsCount']> = async (
  _parent,
  args,
  context,
) => {
  let query = db
    .selectFrom('public.reward as r')
    .select(sql<number>`count(*)::int`.as('count'));

  query = applyRewardFilter(query, args.filter, 'r', context.timezone);

  const row = await query.executeTakeFirstOrThrow();
  return row.count;
};

const categories: NonNullable<QueryResolvers<GraphQLContext>['categories']> = async (
  _parent,
  args,
) => {
  const rows = await db
    .selectFrom('public.category_translation as ct')
    .select('ct.category_name')
    .where('ct.language_code', '=', args.languageCode)
    .groupBy('ct.category_name')
    .orderBy('ct.category_name', 'asc')
    .execute();

  return rows.map(row => row.category_name);
};

/**
 * Root query resolvers.
 */
export const queryResolvers: QueryResolvers<GraphQLContext> = {
  partner,
  partners,
  partnersCount,
  location,
  locations,
  locationsCount,
  reward,
  rewards,
  rewardsCount,
  categories,
};

async function fetchRewards(
  timezone: string,
  info: GraphQLResolveInfo,
  filter: RewardFilter | null | undefined,
  orderBy: RewardOrderByCriteria[] | null | undefined,
  take: number,
): Promise<RewardNode[]> {
  const selectedFields = getSelectedFieldNames(info);

  let query = db
    .selectFrom('public.reward as r')
    .select(['r.id', 'r.partner_id', 'r.redemption_forums', 'r.voucher_type']);

  if (selectedFields.has('earliestExpirationDate')) {
    query = query.select(
      earliestExpirationDateExpression(timezone, 'r').as('earliest_expiration_date'),
    );
  }

  if (selectedFields.has('hasUsageOrQuantityLimit')) {
    query = query.select(
      hasUsageOrQuantityLimitExpression('r').as('has_usage_or_quantity_limit'),
    );
  }

  if (selectedFields.has('voucherOwnership')) {
    query = query.select(voucherOwnershipExpression('r').as('voucher_ownership'));
  }

  query = applyRewardFilter(query, filter, 'r', timezone);
  query = applyRewardOrderBy(query, orderBy, 'r');

  const rows = (await query.limit(take).execute()) as RewardQueryRow[];
  return rows.map(row => mapRewardRow(row));
}

function toIntId(id: string): number | null {
  const value = Number(id);
  return Number.isInteger(value) ? value : null;
}
