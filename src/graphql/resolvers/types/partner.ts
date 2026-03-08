import { sql } from 'kysely';
import { db } from '../../../db';
import type {
  PartnerResolvers,
  PartnerDetails,
  PartnerLocationsArgs,
  PartnerRewardsArgs,
} from '../../../model/generated/graphql/types';
import { JsonbObjectBuilder } from '../helpers/jsonb-builder';
import {
  mapLocationRow,
  mapRewardRow,
  type PartnerNode,
} from '../helpers/mappers';
import {
  applyLocationFilter,
  applyLocationOrderBy,
  applyRewardFilter,
  applyRewardOrderBy,
  normalizeTake,
} from '../helpers/query-builders';
import type { GraphQLContext } from '../helpers/types';

type PartnerRewardRow = {
  id: string;
  partner_id: number;
  redemption_forums: ('ONLINE' | 'IN_STORE')[];
  voucher_type: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL';
};

const translatedDetails: NonNullable<
  PartnerResolvers<GraphQLContext, PartnerNode>['translatedDetails']
> = async (parent, args) => {
  const jsonBuilder = new JsonbObjectBuilder()
    .add('name', sql.ref('pdt.name'))
    .add('logoUrl', sql.ref('pdt.logo_url'))
    .add('description', sql.ref('pdt.description'))
    .add('webAddressUrl', sql.ref('pdt.web_address_url'))
    .add('webAddressText', sql.ref('pdt.web_address_text'))
    .add('reasonForSupporting8by8', sql.ref('pdt.reason_for_supporting_8by8'));

  const row = await db
    .selectFrom('public.partner_details_translation as pdt')
    .select(jsonBuilder.build<PartnerDetails>().as('details'))
    .where('pdt.partner_id', '=', parent._meta.partnerId)
    .where('pdt.language_code', '=', args.languageCode)
    .executeTakeFirstOrThrow();

  return row.details;
};

const locations: NonNullable<PartnerResolvers<GraphQLContext, PartnerNode>['locations']> = async (
  parent,
  args,
  context,
) => {
  const typedArgs = args as PartnerLocationsArgs;

  let query = db
    .selectFrom('public.location as l')
    .leftJoin(
      'public.partner as p_for_location_order',
      'p_for_location_order.id',
      'l.partner_id',
    )
    .select(['l.id', 'l.partner_id', 'l.coordinates'])
    .where('l.partner_id', '=', parent._meta.partnerId);

  query = applyLocationFilter(query, typedArgs.filter, 'l', context.timezone);
  query = applyLocationOrderBy(query, typedArgs.orderBy, 'l');

  const rows = await query.limit(normalizeTake(typedArgs.take)).execute();
  return rows.map(row => mapLocationRow(row));
};

const locationsCount: NonNullable<
  PartnerResolvers<GraphQLContext, PartnerNode>['locationsCount']
> = async (parent, args, context) => {
  let query = db
    .selectFrom('public.location as l')
    .select(sql<number>`count(*)::int`.as('count'))
    .where('l.partner_id', '=', parent._meta.partnerId);

  query = applyLocationFilter(query, args.filter, 'l', context.timezone);

  const row = await query.executeTakeFirstOrThrow();
  return row.count;
};

const rewards: NonNullable<PartnerResolvers<GraphQLContext, PartnerNode>['rewards']> = async (
  parent,
  args,
  context,
) => {
  const typedArgs = args as PartnerRewardsArgs;

  let query = db
    .selectFrom('public.reward as r')
    .select(['r.id', 'r.partner_id', 'r.redemption_forums', 'r.voucher_type'])
    .where('r.partner_id', '=', parent._meta.partnerId);

  query = applyRewardFilter(query, typedArgs.filter, 'r', context.timezone);
  query = applyRewardOrderBy(query, typedArgs.orderBy, 'r');

  const rows = (await query.limit(normalizeTake(typedArgs.take)).execute()) as PartnerRewardRow[];
  return rows.map(row => mapRewardRow(row));
};

const rewardsCount: NonNullable<PartnerResolvers<GraphQLContext, PartnerNode>['rewardsCount']> = async (
  parent,
  args,
  context,
) => {
  let query = db
    .selectFrom('public.reward as r')
    .select(sql<number>`count(*)::int`.as('count'))
    .where('r.partner_id', '=', parent._meta.partnerId);

  query = applyRewardFilter(query, args.filter, 'r', context.timezone);

  const row = await query.executeTakeFirstOrThrow();
  return row.count;
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
