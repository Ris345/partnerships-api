import { sql } from 'kysely';
import type { FieldNode, GraphQLResolveInfo } from 'graphql';
import { db, pgFn } from '../../../db';
import type {
  LocationDistanceArgs,
  PartnerLocationsArgs,
  PartnerLocationsCountArgs,
  PartnerRewardsArgs,
  PartnerRewardsCountArgs,
  PartnerTranslatedDetailsArgs,
  QueryLocationArgs,
  QueryResolvers,
  QueryRewardArgs,
  RewardTranslatedDetailsArgs,
} from '../../../model/generated/graphql/types';
import { argsSignature } from '../helpers/args-signature';
import { CoordinatesBuilder } from '../helpers/builders/coordinates-builder';
import { LocationBuilder } from '../helpers/builders/location-builder';
import { PartnerBuilder } from '../helpers/builders/partner-builder';
import { PartnerDetailsBuilder } from '../helpers/builders/partner-details-builder';
import { RewardBuilder, type RewardSelection } from '../helpers/builders/reward-builder';
import { RewardDetailsBuilder } from '../helpers/builders/reward-details-builder';
import {
  getChildFieldNodesFromFieldNodes,
  getChildFieldRequests,
  getChildFieldRequestsFromFieldNodes,
  getSelectedFieldNamesFromFieldNodes,
} from '../helpers/graphql-info';
import {
  mapLocationRow,
  mapRewardRow,
  type LocationNode,
  type PartnerNode,
  type RewardNode,
} from '../helpers/mappers';
import {
  applyLocationFilter,
  applyLocationOrderBy,
  applyPartnerFilter,
  applyPartnerOrderBy,
  applyRewardFilter,
  applyRewardOrderBy,
  distanceUnitsToDbEnum,
  normalizeTake,
} from '../helpers/query-builders';
import type { GraphQLContext } from '../helpers/types';

type FieldRequestGroup<TArgs> = {
  args: TArgs;
  fieldNodes: FieldNode[];
};

type PartnerRow = { id: string | number };
type LocationRow = {
  id: string | number;
  partner_id: number;
  latitude?: number;
  longitude?: number;
};
type RewardRow = {
  id: string;
  partner_id: number;
  redemption_forums: ('ONLINE' | 'IN_STORE')[];
  voucher_type: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL';
  earliest_expiration_date?: Date | null;
  has_usage_or_quantity_limit?: boolean;
  voucher_ownership?: 'MULTI_USER' | 'SINGLE_USER';
};

const partnerBuilder = new PartnerBuilder();
const partnerDetailsBuilder = new PartnerDetailsBuilder();
const locationBuilder = new LocationBuilder();
const coordinatesBuilder = new CoordinatesBuilder();
const rewardBuilder = new RewardBuilder();
const rewardDetailsBuilder = new RewardDetailsBuilder();

const partner: NonNullable<QueryResolvers<GraphQLContext>['partner']> = async (
  _parent,
  args,
  context,
  info,
) => {
  const parsedId = toIntId(args.id);
  if (parsedId == null) {
    return null;
  }

  let query = db
    .selectFrom('public.partner as p')
    .where('p.id', '=', parsedId);

  query = partnerBuilder.applySelect(query, 'p');

  const row = (await query.executeTakeFirst()) as PartnerRow | undefined;
  if (!row) {
    return null;
  }

  const node = partnerBuilder.mapRow(row);
  await hydratePartners([node], info, context);

  return node;
};

const partners: NonNullable<QueryResolvers<GraphQLContext>['partners']> = async (
  _parent,
  args,
  context,
  info,
) => {
  let query = db.selectFrom('public.partner as p');

  query = partnerBuilder.applySelect(query, 'p');
  query = applyPartnerFilter(query, args.filter, 'p', context.timezone);
  query = applyPartnerOrderBy(query, args.orderBy);

  const rows = (await query.limit(normalizeTake(args.take)).execute()) as PartnerRow[];
  const nodes = rows.map(row => partnerBuilder.mapRow(row));

  await hydratePartners(nodes, info, context);

  return nodes;
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
  context,
  info,
) => {
  const selection = getLocationSelection([info.fieldNodes[0]], info);

  let query = db
    .selectFrom('public.location as l')
    .where('l.id', '=', args.id);

  query = locationBuilder.applySelect(query, selection, 'l');

  const row = (await query.executeTakeFirst()) as LocationRow | undefined;

  if (!row) {
    return null;
  }

  const node = mapLocationRow(row);
  await hydrateLocations([node], [info.fieldNodes[0]], info, context);

  return node;
};

const locations: NonNullable<QueryResolvers<GraphQLContext>['locations']> = async (
  _parent,
  args,
  context,
  info,
) => {
  const selection = getLocationSelection([info.fieldNodes[0]], info);

  let query = db
    .selectFrom('public.location as l')
    .leftJoin(
      'public.partner as p_for_location_order',
      'p_for_location_order.id',
      'l.partner_id',
    );

  query = locationBuilder.applySelect(query, selection, 'l');
  query = applyLocationFilter(query, args.filter, 'l', context.timezone);
  query = applyLocationOrderBy(query, args.orderBy, 'l');

  const rows = (await query.limit(normalizeTake(args.take)).execute()) as LocationRow[];
  const nodes = rows.map(row => mapLocationRow(row));

  await hydrateLocations(nodes, [info.fieldNodes[0]], info, context);

  return nodes;
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
  const selection = RewardBuilder.fromInfo(info);

  let query = db
    .selectFrom('public.reward as r')
    .where('r.id', '=', (args as QueryRewardArgs).id);

  query = rewardBuilder.applySelect(query, context.timezone, selection, 'r');

  const row = (await query.executeTakeFirst()) as RewardRow | undefined;
  if (!row) {
    return null;
  }

  const node = mapRewardRow(row);
  await hydrateRewards([node], [info.fieldNodes[0]], info, context);

  return node;
};

const rewards: NonNullable<QueryResolvers<GraphQLContext>['rewards']> = async (
  _parent,
  args,
  context,
  info,
) => {
  const selection = RewardBuilder.fromInfo(info);

  let query = db.selectFrom('public.reward as r');

  query = rewardBuilder.applySelect(query, context.timezone, selection, 'r');
  query = applyRewardFilter(query, args.filter, 'r', context.timezone);
  query = applyRewardOrderBy(query, args.orderBy, 'r');

  const rows = (await query.limit(normalizeTake(args.take)).execute()) as RewardRow[];
  const nodes = rows.map(row => mapRewardRow(row));

  await hydrateRewards(nodes, [info.fieldNodes[0]], info, context);

  return nodes;
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

async function hydratePartners(
  nodes: PartnerNode[],
  info: GraphQLResolveInfo,
  context: GraphQLContext,
): Promise<void> {
  if (!nodes.length) {
    return;
  }

  const partnerIds = nodes.map(node => node._meta.partnerId);

  const translatedDetailsRequests = getChildFieldRequests<PartnerTranslatedDetailsArgs>(
    info,
    'translatedDetails',
  );

  for (const [signature, request] of groupFieldRequests(translatedDetailsRequests)) {
    const rows = await db
      .selectFrom('public.partner_details_translation as pdt')
      .select([
        'pdt.partner_id',
        partnerDetailsBuilder.buildJsonExpression('pdt').as('details'),
      ])
      .where('pdt.language_code', '=', request.args.languageCode)
      .where('pdt.partner_id', 'in', partnerIds)
      .execute();

    const detailsByPartnerId = new Map(rows.map(row => [row.partner_id, row.details]));

    for (const node of nodes) {
      const details = detailsByPartnerId.get(node._meta.partnerId);
      if (!details) {
        throw new Error(
          `Missing partner translatedDetails for partner ${node.id} and language ${request.args.languageCode}`,
        );
      }

      node._meta.translatedDetailsByArgs[signature] = details;
    }
  }

  const locationsRequests = getChildFieldRequests<PartnerLocationsArgs>(info, 'locations');
  for (const [signature, request] of groupFieldRequests(locationsRequests)) {
    const locationSelection = getLocationSelection(request.fieldNodes, info);
    const loadedLocations: LocationNode[] = [];

    for (const node of nodes) {
      let query = db
        .selectFrom('public.location as l')
        .leftJoin(
          'public.partner as p_for_location_order',
          'p_for_location_order.id',
          'l.partner_id',
        )
        .where('l.partner_id', '=', node._meta.partnerId);

      query = locationBuilder.applySelect(query, locationSelection, 'l');
      query = applyLocationFilter(query, request.args.filter, 'l', context.timezone);
      query = applyLocationOrderBy(query, request.args.orderBy, 'l');

      const rows = (await query.limit(normalizeTake(request.args.take)).execute()) as LocationRow[];
      const mapped = rows.map(row => mapLocationRow(row));

      node._meta.locationsByArgs[signature] = mapped;
      loadedLocations.push(...mapped);
    }

    await hydrateLocations(loadedLocations, request.fieldNodes, info, context);
  }

  const locationsCountRequests = getChildFieldRequests<PartnerLocationsCountArgs>(
    info,
    'locationsCount',
  );

  for (const [signature, request] of groupFieldRequests(locationsCountRequests)) {
    for (const node of nodes) {
      let query = db
        .selectFrom('public.location as l')
        .select(sql<number>`count(*)::int`.as('count'))
        .where('l.partner_id', '=', node._meta.partnerId);

      query = applyLocationFilter(query, request.args.filter, 'l', context.timezone);
      const row = await query.executeTakeFirstOrThrow();

      node._meta.locationsCountByArgs[signature] = row.count;
    }
  }

  const rewardsRequests = getChildFieldRequests<PartnerRewardsArgs>(info, 'rewards');
  for (const [signature, request] of groupFieldRequests(rewardsRequests)) {
    const rewardSelection = getRewardSelection(request.fieldNodes, info);
    const loadedRewards: RewardNode[] = [];

    for (const node of nodes) {
      let query = db
        .selectFrom('public.reward as r')
        .where('r.partner_id', '=', node._meta.partnerId);

      query = rewardBuilder.applySelect(query, context.timezone, rewardSelection, 'r');
      query = applyRewardFilter(query, request.args.filter, 'r', context.timezone);
      query = applyRewardOrderBy(query, request.args.orderBy, 'r');

      const rows = (await query.limit(normalizeTake(request.args.take)).execute()) as RewardRow[];
      const mapped = rows.map(row => mapRewardRow(row));

      node._meta.rewardsByArgs[signature] = mapped;
      loadedRewards.push(...mapped);
    }

    await hydrateRewards(loadedRewards, request.fieldNodes, info, context);
  }

  const rewardsCountRequests = getChildFieldRequests<PartnerRewardsCountArgs>(
    info,
    'rewardsCount',
  );

  for (const [signature, request] of groupFieldRequests(rewardsCountRequests)) {
    for (const node of nodes) {
      let query = db
        .selectFrom('public.reward as r')
        .select(sql<number>`count(*)::int`.as('count'))
        .where('r.partner_id', '=', node._meta.partnerId);

      query = applyRewardFilter(query, request.args.filter, 'r', context.timezone);
      const row = await query.executeTakeFirstOrThrow();

      node._meta.rewardsCountByArgs[signature] = row.count;
    }
  }
}

async function hydrateLocations(
  nodes: LocationNode[],
  parentFieldNodes: FieldNode[],
  info: GraphQLResolveInfo,
  _context: GraphQLContext,
): Promise<void> {
  if (!nodes.length) {
    return;
  }

  const coordinatesNodes = getChildFieldNodesFromFieldNodes(
    parentFieldNodes,
    info.fragments,
    'coordinates',
  );

  if (coordinatesNodes.length) {
    const selection = getCoordinatesSelection(coordinatesNodes, info);

    if (selection.latitude || selection.longitude) {
      const ids = nodes.map(node => node.id);

      let query = db
        .selectFrom('public.location as l')
        .select('l.id')
        .where('l.id', 'in', ids);

      query = coordinatesBuilder.applySelect(query, selection, 'l');
      const rows = (await query.execute()) as Array<{
        id: string;
        latitude?: number;
        longitude?: number;
      }>;

      const byId = new Map(rows.map(row => [row.id, row]));
      for (const node of nodes) {
        const row = byId.get(node.id);
        if (!row) {
          continue;
        }

        if (selection.latitude && row.latitude !== undefined) {
          node.coordinates.latitude = row.latitude;
        }

        if (selection.longitude && row.longitude !== undefined) {
          node.coordinates.longitude = row.longitude;
        }
      }
    }
  }

  const distanceNodes = getChildFieldNodesFromFieldNodes(
    parentFieldNodes,
    info.fragments,
    'distance',
  );
  const distanceRequests = getChildFieldRequestsFromFieldNodes<LocationDistanceArgs>(
    distanceNodes,
    info.variableValues,
  );

  for (const [signature, request] of groupFieldRequests(distanceRequests)) {
    for (const node of nodes) {
      let query = db
        .selectFrom('public.location as l')
        .where('l.id', '=', node.id)
        .select(
          pgFn('public.calc_distance_with_units', [
            sql.ref('l.coordinates') as never,
            pgFn('public.make_geographic_point', [
              sql.val(request.args.from.longitude),
              sql.val(request.args.from.latitude),
            ]) as never,
            sql.val(distanceUnitsToDbEnum(request.args.units)),
          ]).as('distance'),
        );

      const row = await query.executeTakeFirstOrThrow();
      node._meta.distanceByArgs[signature] = row.distance;
    }
  }
}

async function hydrateRewards(
  nodes: RewardNode[],
  parentFieldNodes: FieldNode[],
  info: GraphQLResolveInfo,
  _context: GraphQLContext,
): Promise<void> {
  if (!nodes.length) {
    return;
  }

  const translatedDetailsNodes = getChildFieldNodesFromFieldNodes(
    parentFieldNodes,
    info.fragments,
    'translatedDetails',
  );

  const translatedDetailsRequests = getChildFieldRequestsFromFieldNodes<RewardTranslatedDetailsArgs>(
    translatedDetailsNodes,
    info.variableValues,
  );

  const rewardIds = nodes.map(node => node.id);

  for (const [signature, request] of groupFieldRequests(translatedDetailsRequests)) {
    const detailsRows = await db
      .selectFrom('public.reward_details_translation as rdt')
      .select([
        'rdt.reward_id',
        rewardDetailsBuilder.buildJsonExpression('rdt').as('details'),
      ])
      .where('rdt.language_code', '=', request.args.languageCode)
      .where('rdt.reward_id', 'in', rewardIds)
      .execute();

    const categoriesRows = await db
      .selectFrom('public.reward_category as rc')
      .innerJoin('public.category_translation as ct', join =>
        join
          .onRef('ct.category_id', '=', 'rc.category_id')
          .on('ct.language_code', '=', request.args.languageCode),
      )
      .select([
        'rc.reward_id',
        sql<string[]>`array_agg(ct.category_name order by ct.category_name)`.as('categories'),
      ])
      .where('rc.reward_id', 'in', rewardIds)
      .groupBy('rc.reward_id')
      .execute();

    const detailsByRewardId = new Map(detailsRows.map(row => [row.reward_id, row.details]));
    const categoriesByRewardId = new Map(
      categoriesRows.map(row => [row.reward_id, row.categories]),
    );

    for (const node of nodes) {
      const details = detailsByRewardId.get(node.id);
      if (!details) {
        throw new Error(
          `Missing reward translatedDetails for reward ${node.id} and language ${request.args.languageCode}`,
        );
      }

      node._meta.translatedDetailsByArgs[signature] = {
        shortDescription: details.shortDescription,
        longDescription: details.longDescription ?? null,
        categories: categoriesByRewardId.get(node.id) ?? [],
      };
    }
  }
}

function getLocationSelection(
  parentFieldNodes: FieldNode[],
  info: GraphQLResolveInfo,
): {
  coordinatesLatitude: boolean;
  coordinatesLongitude: boolean;
} {
  const coordinatesNodes = getChildFieldNodesFromFieldNodes(
    parentFieldNodes,
    info.fragments,
    'coordinates',
  );

  if (!coordinatesNodes.length) {
    return {
      coordinatesLatitude: false,
      coordinatesLongitude: false,
    };
  }

  const selected = getSelectedFieldNamesFromFieldNodes(coordinatesNodes, info.fragments);

  return {
    coordinatesLatitude: selected.has('latitude'),
    coordinatesLongitude: selected.has('longitude'),
  };
}

function getCoordinatesSelection(
  coordinatesFieldNodes: FieldNode[],
  info: GraphQLResolveInfo,
): {
  latitude: boolean;
  longitude: boolean;
} {
  const selected = getSelectedFieldNamesFromFieldNodes(coordinatesFieldNodes, info.fragments);

  return {
    latitude: selected.has('latitude'),
    longitude: selected.has('longitude'),
  };
}

function getRewardSelection(
  parentFieldNodes: FieldNode[],
  info: GraphQLResolveInfo,
): RewardSelection {
  const selected = getSelectedFieldNamesFromFieldNodes(parentFieldNodes, info.fragments);

  return {
    earliestExpirationDate: selected.has('earliestExpirationDate'),
    hasUsageOrQuantityLimit: selected.has('hasUsageOrQuantityLimit'),
    voucherOwnership: selected.has('voucherOwnership'),
  };
}

function groupFieldRequests<TArgs extends object>(
  requests: Array<{ args: TArgs; fieldNode: FieldNode }>,
): Map<string, FieldRequestGroup<TArgs>> {
  const grouped = new Map<string, FieldRequestGroup<TArgs>>();

  for (const request of requests) {
    const signature = argsSignature(request.args);
    const existing = grouped.get(signature);

    if (existing) {
      existing.fieldNodes.push(request.fieldNode);
      continue;
    }

    grouped.set(signature, {
      args: request.args,
      fieldNodes: [request.fieldNode],
    });
  }

  return grouped;
}

function toIntId(id: QueryLocationArgs['id']): number | null {
  const value = Number(id);
  return Number.isInteger(value) ? value : null;
}
