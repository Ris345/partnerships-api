import { sql, type RawBuilder, type SelectQueryBuilder } from 'kysely';
import { pgFn } from '../../../model/generated/db/types';
import type {
  BooleanFilter,
  DateTimeFilter,
  DistanceOrderByCriteria,
  DistanceUnits,
  DistanceWithinFilter,
  IdFilter,
  IntFilter,
  LocationFilter,
  LocationOrderByCriteria,
  PartnerDetailsFilter,
  PartnerDetailsOrderByCriteria,
  PartnerFilter,
  PartnerOrderByCriteria,
  QueryLocationsArgs,
  QueryPartnersArgs,
  QueryRewardsArgs,
  RedemptionForum,
  RedemptionForumArrayFilter,
  RewardDetailsFilter,
  RewardDetailsOrderByCriteria,
  RewardFilter,
  RewardOrderByCriteria,
  SortOrder,
  StringArrayFilter,
  StringFilter,
  VoucherOwnershipFilter,
} from '../../../model/generated/graphql/types';
import type { Point } from '../../../model/point';
import {
  earliestExpirationDateExpression,
  hasUsageOrQuantityLimitExpression,
  voucherOwnershipExpression,
} from './reward-expressions';
import { toSqlSortOrder } from './types';

/**
 * Applies partner filter conditions recursively.
 */
export function applyPartnerFilter<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  filter: PartnerFilter | null | undefined,
  alias = 'p',
  timezone = 'UTC',
): SelectQueryBuilder<DB, TB, O> {
  if (!filter) return query;

  return query.where(buildPartnerFilterExpression(filter, alias, timezone));
}

/**
 * Applies reward filter conditions recursively.
 */
export function applyRewardFilter<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  filter: RewardFilter | null | undefined,
  alias = 'r',
  timezone = 'UTC',
): SelectQueryBuilder<DB, TB, O> {
  if (!filter) return query;

  return query.where(buildRewardFilterExpression(filter, alias, timezone));
}

/**
 * Applies location filter conditions recursively.
 */
export function applyLocationFilter<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  filter: LocationFilter | null | undefined,
  alias = 'l',
  timezone = 'UTC',
): SelectQueryBuilder<DB, TB, O> {
  if (!filter) return query;

  return query.where(buildLocationFilterExpression(filter, alias, timezone));
}

export function applyPartnerOrderBy<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  orderBy: PartnerOrderByCriteria[] | null | undefined,
  alias = 'p',
): SelectQueryBuilder<DB, TB, O> {
  if (!orderBy?.length) {
    return query.orderBy(sql.ref(`${alias}.id`), 'asc');
  }

  let next = query;

  for (const criteria of orderBy) {
    if ('id' in criteria) {
      next = next.orderBy(sql.ref(`${alias}.id`), toSqlSortOrder(criteria.id));
      continue;
    }

    const translated = criteria.translatedDetails;
    next = applyPartnerDetailsOrderBy(
      next,
      translated._orderBy,
      translated._languageCode,
      alias,
    );
  }

  return next;
}

export function applyLocationOrderBy<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  orderBy: LocationOrderByCriteria[] | null | undefined,
  alias = 'l',
): SelectQueryBuilder<DB, TB, O> {
  if (!orderBy?.length) {
    return query.orderBy(sql.ref(`${alias}.id`), 'asc');
  }

  let next = query;

  for (const criteria of orderBy) {
    if ('id' in criteria) {
      next = next.orderBy(sql.ref(`${alias}.id`), toSqlSortOrder(criteria.id));
      continue;
    }

    if ('distance' in criteria) {
      next = applyDistanceOrderBy(next, criteria.distance, alias);
      continue;
    }

    next = applyPartnerOrderBy(next, [criteria.partner], 'p_for_location_order');
  }

  return next;
}

export function applyRewardOrderBy<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  orderBy: RewardOrderByCriteria[] | null | undefined,
  alias = 'r',
): SelectQueryBuilder<DB, TB, O> {
  if (!orderBy?.length) {
    return query.orderBy(sql.ref(`${alias}.id`), 'asc');
  }

  let next = query;

  for (const criteria of orderBy) {
    if ('id' in criteria) {
      next = next.orderBy(sql.ref(`${alias}.id`), toSqlSortOrder(criteria.id));
      continue;
    }

    if ('partner' in criteria) {
      next = applyPartnerOrderByForReward(next, criteria.partner, alias);
      continue;
    }

    const translated = criteria.translatedDetails;
    next = applyRewardDetailsOrderBy(
      next,
      translated._orderBy,
      translated._languageCode,
      alias,
    );
  }

  return next;
}

function buildPartnerFilterExpression(
  filter: PartnerFilter,
  alias: string,
  timezone: string,
): RawBuilder<boolean> {
  if ('_and' in filter) {
    return and(filter._and.map(item => buildPartnerFilterExpression(item, alias, timezone)));
  }

  if ('_or' in filter) {
    return or(filter._or.map(item => buildPartnerFilterExpression(item, alias, timezone)));
  }

  if ('_not' in filter) {
    return sql<boolean>`not (${buildPartnerFilterExpression(filter._not, alias, timezone)})`;
  }

  if ('id' in filter) {
    return buildIdFilterExpression(sql.ref(`${alias}.id`), filter.id, 'int');
  }

  if ('translatedDetails' in filter) {
    const translated = filter.translatedDetails;

    return sql<boolean>`exists (
      select 1
      from public.partner_details_translation pdt
      where pdt.partner_id = ${sql.ref(`${alias}.id`)}
        and pdt.language_code = ${translated._languageCode}
        and ${buildPartnerDetailsFilterExpression(translated._filter, 'pdt')}
    )`;
  }

  if ('locationsCount' in filter) {
    const countFilter = filter.locationsCount;

    return buildIntFilterExpression(
      sql<number>`(
        select count(*)::int
        from public.location l2
        where l2.partner_id = ${sql.ref(`${alias}.id`)}
        ${countFilter._filter ? sql`and ${buildLocationFilterExpression(countFilter._filter, 'l2', timezone)}` : sql``}
      )`,
      countFilter._value,
    );
  }

  const countFilter = filter.rewardsCount;

  return buildIntFilterExpression(
    sql<number>`(
      select count(*)::int
      from public.reward r2
      where r2.partner_id = ${sql.ref(`${alias}.id`)}
      ${countFilter._filter ? sql`and ${buildRewardFilterExpression(countFilter._filter, 'r2', timezone)}` : sql``}
    )`,
    countFilter._value,
  );
}

function buildLocationFilterExpression(
  filter: LocationFilter,
  alias: string,
  timezone: string,
): RawBuilder<boolean> {
  if ('_and' in filter) {
    return and(filter._and.map(item => buildLocationFilterExpression(item, alias, timezone)));
  }

  if ('_or' in filter) {
    return or(filter._or.map(item => buildLocationFilterExpression(item, alias, timezone)));
  }

  if ('_not' in filter) {
    return sql<boolean>`not (${buildLocationFilterExpression(filter._not, alias, timezone)})`;
  }

  if ('id' in filter) {
    return buildIdFilterExpression(sql.ref(`${alias}.id`), filter.id, 'text');
  }

  if ('distance' in filter) {
    return buildDistanceWithinExpression(
      sql<Point>`${sql.ref(`${alias}.coordinates`)}`,
      filter.distance._within,
    );
  }

  return sql<boolean>`exists (
    select 1
    from public.partner p2
    where p2.id = ${sql.ref(`${alias}.partner_id`)}
      and ${buildPartnerFilterExpression(filter.partner, 'p2', timezone)}
  )`;
}

function buildRewardFilterExpression(
  filter: RewardFilter,
  alias: string,
  timezone: string,
): RawBuilder<boolean> {
  if ('_and' in filter) {
    return and(filter._and.map(item => buildRewardFilterExpression(item, alias, timezone)));
  }

  if ('_or' in filter) {
    return or(filter._or.map(item => buildRewardFilterExpression(item, alias, timezone)));
  }

  if ('_not' in filter) {
    return sql<boolean>`not (${buildRewardFilterExpression(filter._not, alias, timezone)})`;
  }

  if ('id' in filter) {
    return buildIdFilterExpression(sql.ref(`${alias}.id`), filter.id, 'uuid');
  }

  if ('voucherType' in filter) {
    return buildVoucherOwnershipFilterExpression(voucherOwnershipExpression(alias), filter.voucherType);
  }

  if ('redemptionForums' in filter) {
    return buildRedemptionForumArrayFilterExpression(
      sql.ref(`${alias}.redemption_forums`),
      filter.redemptionForums,
    );
  }

  if ('translatedDetails' in filter) {
    const translated = filter.translatedDetails;

    return sql<boolean>`exists (
      select 1
      from public.reward_details_translation rdt
      where rdt.reward_id = ${sql.ref(`${alias}.id`)}
        and rdt.language_code = ${translated._languageCode}
        and ${buildRewardDetailsFilterExpression(translated._filter, 'rdt', alias, translated._languageCode)}
    )`;
  }

  if ('partner' in filter) {
    return sql<boolean>`exists (
      select 1
      from public.partner p2
      where p2.id = ${sql.ref(`${alias}.partner_id`)}
        and ${buildPartnerFilterExpression(filter.partner, 'p2', timezone)}
    )`;
  }

  if ('hasUsageOrQuantityLimit' in filter) {
    return buildBooleanFilterExpression(
      hasUsageOrQuantityLimitExpression(alias),
      filter.hasUsageOrQuantityLimit,
    );
  }

  return buildDateTimeFilterExpression(
    earliestExpirationDateExpression(timezone, alias),
    filter.earliestExpirationDate,
  );
}

function buildPartnerDetailsFilterExpression(
  filter: PartnerDetailsFilter,
  alias: string,
): RawBuilder<boolean> {
  if ('_and' in filter) {
    return and(filter._and.map(item => buildPartnerDetailsFilterExpression(item, alias)));
  }

  if ('_or' in filter) {
    return or(filter._or.map(item => buildPartnerDetailsFilterExpression(item, alias)));
  }

  if ('_not' in filter) {
    return sql<boolean>`not (${buildPartnerDetailsFilterExpression(filter._not, alias)})`;
  }

  if ('name' in filter) {
    return buildStringFilterExpression(sql.ref(`${alias}.name`), filter.name);
  }

  if ('logoUrl' in filter) {
    return buildStringFilterExpression(sql.ref(`${alias}.logo_url`), filter.logoUrl);
  }

  if ('description' in filter) {
    return buildStringFilterExpression(sql.ref(`${alias}.description`), filter.description);
  }

  if ('webAddressUrl' in filter) {
    return buildStringFilterExpression(sql.ref(`${alias}.web_address_url`), filter.webAddressUrl);
  }

  if ('webAddressText' in filter) {
    return buildStringFilterExpression(sql.ref(`${alias}.web_address_text`), filter.webAddressText);
  }

  return buildStringFilterExpression(
    sql.ref(`${alias}.reason_for_supporting_8by8`),
    filter.reasonForSupporting8by8,
  );
}

function buildRewardDetailsFilterExpression(
  filter: RewardDetailsFilter,
  alias: string,
  rewardAlias: string,
  languageCode: string,
): RawBuilder<boolean> {
  if ('_and' in filter) {
    return and(
      filter._and.map(item =>
        buildRewardDetailsFilterExpression(item, alias, rewardAlias, languageCode),
      ),
    );
  }

  if ('_or' in filter) {
    return or(
      filter._or.map(item =>
        buildRewardDetailsFilterExpression(item, alias, rewardAlias, languageCode),
      ),
    );
  }

  if ('_not' in filter) {
    return sql<boolean>`not (${buildRewardDetailsFilterExpression(filter._not, alias, rewardAlias, languageCode)})`;
  }

  if ('shortDescription' in filter) {
    return buildStringFilterExpression(sql.ref(`${alias}.short_description`), filter.shortDescription);
  }

  if ('longDescription' in filter) {
    return buildStringFilterExpression(sql.ref(`${alias}.long_description`), filter.longDescription);
  }

  return buildStringArrayFilterExpression(
    rewardCategoriesByLanguageExpression(rewardAlias, languageCode),
    filter.categories,
  );
}

function applyPartnerDetailsOrderBy<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  orderBy: PartnerDetailsOrderByCriteria,
  languageCode: string,
  partnerAlias: string,
): SelectQueryBuilder<DB, TB, O> {
  const [field, sort] = firstEntry(orderBy);

  const columnByField: Record<string, string> = {
    name: 'name',
    logoUrl: 'logo_url',
    description: 'description',
    webAddressUrl: 'web_address_url',
    webAddressText: 'web_address_text',
    reasonForSupporting8by8: 'reason_for_supporting_8by8',
  };

  return query.orderBy(
    sql`(
      select ${sql.ref(`pdt_order.${columnByField[field]}`)}
      from public.partner_details_translation pdt_order
      where pdt_order.partner_id = ${sql.ref(`${partnerAlias}.id`)}
        and pdt_order.language_code = ${languageCode}
    )`,
    toSqlSortOrder(sort as SortOrder),
  );
}

function applyRewardDetailsOrderBy<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  orderBy: RewardDetailsOrderByCriteria,
  languageCode: string,
  rewardAlias: string,
): SelectQueryBuilder<DB, TB, O> {
  const [field, sort] = firstEntry(orderBy);

  if (field === 'categories') {
    return query.orderBy(
      sql`(
        select array_agg(ct.category_name order by ct.category_name)
        from public.reward_category rc_order
        join public.category_translation ct
          on ct.category_id = rc_order.category_id
         and ct.language_code = ${languageCode}
        where rc_order.reward_id = ${sql.ref(`${rewardAlias}.id`)}
      )`,
      toSqlSortOrder(sort as SortOrder),
    );
  }

  const column = field === 'shortDescription' ? 'short_description' : 'long_description';

  return query.orderBy(
    sql`(
      select ${sql.ref(`rdt_order.${column}`)}
      from public.reward_details_translation rdt_order
      where rdt_order.reward_id = ${sql.ref(`${rewardAlias}.id`)}
        and rdt_order.language_code = ${languageCode}
    )`,
    toSqlSortOrder(sort as SortOrder),
  );
}

function applyDistanceOrderBy<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  criteria: DistanceOrderByCriteria,
  locationAlias: string,
): SelectQueryBuilder<DB, TB, O> {
  return query.orderBy(
    sql`${sql.ref(`${locationAlias}.coordinates`)} <-> ${pgFn('public.make_geographic_point', [
      sql.val(criteria._from.longitude),
      sql.val(criteria._from.latitude),
    ])}`,
    toSqlSortOrder(criteria._sortOrder),
  );
}

function applyPartnerOrderByForReward<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  orderBy: PartnerOrderByCriteria,
  rewardAlias: string,
): SelectQueryBuilder<DB, TB, O> {
  if ('id' in orderBy) {
    return query.orderBy(
      sql`(
        select p_order.id
        from public.partner p_order
        where p_order.id = ${sql.ref(`${rewardAlias}.partner_id`)}
      )`,
      toSqlSortOrder(orderBy.id),
    );
  }

  const translated = orderBy.translatedDetails;
  return applyPartnerDetailsOrderByForReward(
    query,
    translated._orderBy,
    translated._languageCode,
    rewardAlias,
  );
}

function applyPartnerDetailsOrderByForReward<DB, TB extends keyof DB, O>(
  query: SelectQueryBuilder<DB, TB, O>,
  orderBy: PartnerDetailsOrderByCriteria,
  languageCode: string,
  rewardAlias: string,
): SelectQueryBuilder<DB, TB, O> {
  const [field, sort] = firstEntry(orderBy);

  const columnByField: Record<string, string> = {
    name: 'name',
    logoUrl: 'logo_url',
    description: 'description',
    webAddressUrl: 'web_address_url',
    webAddressText: 'web_address_text',
    reasonForSupporting8by8: 'reason_for_supporting_8by8',
  };

  return query.orderBy(
    sql`(
      select ${sql.ref(`pdt_order.${columnByField[field]}`)}
      from public.partner p_order
      join public.partner_details_translation pdt_order
        on pdt_order.partner_id = p_order.id
       and pdt_order.language_code = ${languageCode}
      where p_order.id = ${sql.ref(`${rewardAlias}.partner_id`)}
    )`,
    toSqlSortOrder(sort as SortOrder),
  );
}

function buildDistanceWithinExpression(
  pointExpression: RawBuilder<Point>,
  filter: DistanceWithinFilter,
): RawBuilder<boolean> {
  const originPoint = pgFn('public.make_geographic_point', [
    sql.val(filter._from.longitude),
    sql.val(filter._from.latitude),
  ]);

  return sql<boolean>`${pgFn('public.st_dwithin', [
    pointExpression,
    sql<Point>`${originPoint}::geography`,
    sql<number>`coalesce(${pgFn('public.convert_distance', [
      sql.val(filter._radius),
      sql.val<'METERS' | 'KILOMETERS' | 'MILES'>(
        distanceUnitsToDbEnum(filter._units),
      ),
      sql.val<'METERS'>('METERS'),
    ])}, 0)`,
  ])}`;
}

function buildBooleanFilterExpression(
  expression: RawBuilder<unknown>,
  filter: BooleanFilter,
): RawBuilder<boolean> {
  if ('_eq' in filter) {
    return sql<boolean>`${expression} = ${filter._eq}`;
  }

  return sql<boolean>`${expression} <> ${filter._neq}`;
}

function buildDateTimeFilterExpression(
  expression: RawBuilder<unknown>,
  filter: DateTimeFilter,
): RawBuilder<boolean> {
  const [operation, value] = firstEntry(filter);
  return buildComparisonExpression(expression, operation, value);
}

function buildIntFilterExpression(
  expression: RawBuilder<unknown>,
  filter: IntFilter,
): RawBuilder<boolean> {
  const [operation, value] = firstEntry(filter);
  return buildComparisonExpression(expression, operation, value);
}

function buildVoucherOwnershipFilterExpression(
  expression: RawBuilder<unknown>,
  filter: VoucherOwnershipFilter,
): RawBuilder<boolean> {
  if ('_eq' in filter) {
    return sql<boolean>`${expression} = ${filter._eq}`;
  }

  return sql<boolean>`${expression} <> ${filter._neq}`;
}

function buildIdFilterExpression(
  expression: RawBuilder<unknown>,
  filter: IdFilter,
  kind: 'int' | 'text' | 'uuid',
): RawBuilder<boolean> {
  const [operation, rawValue] = firstEntry(filter);

  if (operation === '_containedBy') {
    return sql<boolean>`${expression} = any(${castIdArray(rawValue as string[], kind)})`;
  }

  return buildComparisonExpression(expression, operation, castId(rawValue as string, kind));
}

function castIdArray(values: string[], kind: 'int' | 'text' | 'uuid'): RawBuilder<unknown> {
  if (kind === 'int') {
    return sql`array[${sql.join(values.map(value => Number(value)))}]::int[]`;
  }

  if (kind === 'text') {
    return sql`array[${sql.join(values)}]::text[]`;
  }

  return sql`array[${sql.join(values)}]::uuid[]`;
}

function castId(value: string, kind: 'int' | 'text' | 'uuid'): unknown {
  if (kind === 'int') return Number(value);
  if (kind === 'text') return value;
  return value;
}

function buildStringFilterExpression(
  expression: RawBuilder<unknown>,
  filter: StringFilter,
): RawBuilder<boolean> {
  const [operation, value] = firstEntry(filter);

  if (operation === '_eq' || operation === '_neq') {
    const finalValue = (value as { _value: string })._value;
    const ignoreCase = Boolean((value as { _ignoreCase?: boolean })._ignoreCase);

    if (ignoreCase) {
      return sql<boolean>`lower(${expression}::text) ${sql.raw(operation === '_eq' ? '=' : '<>')} lower(${finalValue})`;
    }

    return sql<boolean>`${expression}::text ${sql.raw(operation === '_eq' ? '=' : '<>')} ${finalValue}`;
  }

  if (operation === '_includes') {
    const finalValue = (value as { _value: string })._value;
    const ignoreCase = Boolean((value as { _ignoreCase?: boolean })._ignoreCase);

    if (ignoreCase) {
      return sql<boolean>`lower(${expression}::text) like lower(${`%${finalValue}%`})`;
    }

    return sql<boolean>`${expression}::text like ${`%${finalValue}%`}`;
  }

  if (operation === '_like') {
    const finalValue = (value as { _value: string })._value;
    const ignoreCase = Boolean((value as { _ignoreCase?: boolean })._ignoreCase);

    if (ignoreCase) {
      return sql<boolean>`lower(${expression}::text) like lower(${finalValue})`;
    }

    return sql<boolean>`${expression}::text like ${finalValue}`;
  }

  if (operation === '_containedBy') {
    const finalValue = (value as { _value: string[] })._value;
    const ignoreCase = Boolean((value as { _ignoreCase?: boolean })._ignoreCase);

    if (ignoreCase) {
      return sql<boolean>`exists (
        select 1
        from unnest(${sql`array[${sql.join(finalValue)}]::text[]`}) as cmp(v)
        where lower(cmp.v) = lower(${expression}::text)
      )`;
    }

    return sql<boolean>`${expression}::text = any(${sql`array[${sql.join(finalValue)}]::text[]`})`;
  }

  return buildComparisonExpression(expression, operation, value);
}

function buildStringArrayFilterExpression(
  expression: RawBuilder<unknown>,
  filter: StringArrayFilter,
): RawBuilder<boolean> {
  const [operation, value] = firstEntry(filter);

  if (operation === '_containsEl') {
    const finalValue = (value as { _value: string })._value;
    const ignoreCase = Boolean((value as { _ignoreCase?: boolean })._ignoreCase);

    if (ignoreCase) {
      return sql<boolean>`exists (
        select 1
        from unnest(${expression}::text[]) as src(v)
        where lower(src.v) = lower(${finalValue})
      )`;
    }

    return sql<boolean>`${expression} @> array[${finalValue}]::text[]`;
  }

  if (operation === '_eq' || operation === '_neq') {
    const values = (value as { _value: string[] })._value;
    const ignoreCase = Boolean((value as { _ignoreCase?: boolean })._ignoreCase);

    const operator = operation === '_eq' ? '=' : '<>';
    if (ignoreCase) {
      return sql<boolean>`(
        select array_agg(lower(src.v) order by lower(src.v))
        from unnest(${expression}::text[]) src(v)
      ) ${sql.raw(operator)} (
        select array_agg(lower(cmp.v) order by lower(cmp.v))
        from unnest(${sql`array[${sql.join(values)}]::text[]`}) cmp(v)
      )`;
    }

    return sql<boolean>`${expression} ${sql.raw(operator)} ${sql`array[${sql.join(values)}]::text[]`}`;
  }

  const values = (value as { _value: string[] })._value;
  const ignoreCase = Boolean((value as { _ignoreCase?: boolean })._ignoreCase);

  const opMap: Record<string, string> = {
    _containsArr: '@>',
    _containedBy: '<@',
    _overlaps: '&&',
  };

  if (ignoreCase) {
    return sql<boolean>`(
      select array_agg(lower(src.v) order by lower(src.v))
      from unnest(${expression}::text[]) src(v)
    ) ${sql.raw(opMap[operation])} (
      select array_agg(lower(cmp.v) order by lower(cmp.v))
      from unnest(${sql`array[${sql.join(values)}]::text[]`}) cmp(v)
    )`;
  }

  return sql<boolean>`${expression} ${sql.raw(opMap[operation])} ${sql`array[${sql.join(values)}]::text[]`}`;
}

function buildRedemptionForumArrayFilterExpression(
  expression: RawBuilder<unknown>,
  filter: RedemptionForumArrayFilter,
): RawBuilder<boolean> {
  const [operation, value] = firstEntry(filter);

  if (operation === '_containsEl') {
    return sql<boolean>`${expression} @> array[${value}]::redemption_forum[]`;
  }

  const values = value as RedemptionForum[];
  const opMap: Record<string, string> = {
    _eq: '=',
    _neq: '<>',
    _containsArr: '@>',
    _containedBy: '<@',
    _overlaps: '&&',
  };

  return sql<boolean>`${expression} ${sql.raw(opMap[operation])} ${sql`array[${sql.join(values)}]::redemption_forum[]`}`;
}

function buildComparisonExpression(
  expression: RawBuilder<unknown>,
  operation: string,
  value: unknown,
): RawBuilder<boolean> {
  const opMap: Record<string, string> = {
    _eq: '=',
    _neq: '<>',
    _gt: '>',
    _lt: '<',
    _gte: '>=',
    _lte: '<=',
  };

  return sql<boolean>`${expression} ${sql.raw(opMap[operation])} ${sql.val(value)}`;
}

function rewardCategoriesByLanguageExpression(
  rewardAlias: string,
  languageCode: string,
): RawBuilder<string[]> {
  return sql<string[]>`(
    select coalesce(array_agg(ct.category_name order by ct.category_name), '{}'::text[])
    from public.reward_category rc
    join public.category_translation ct
      on ct.category_id = rc.category_id
     and ct.language_code = ${languageCode}
    where rc.reward_id = ${sql.ref(`${rewardAlias}.id`)}
  )`;
}

function and(expressions: RawBuilder<boolean>[]): RawBuilder<boolean> {
  if (!expressions.length) {
    return sql<boolean>`true`;
  }

  return sql<boolean>`(${sql.join(expressions, sql` and `)})`;
}

function or(expressions: RawBuilder<boolean>[]): RawBuilder<boolean> {
  if (!expressions.length) {
    return sql<boolean>`false`;
  }

  return sql<boolean>`(${sql.join(expressions, sql` or `)})`;
}

function firstEntry<T extends object>(value: T): [keyof T & string, T[keyof T]] {
  const [key, entryValue] = Object.entries(value)[0] as [keyof T & string, T[keyof T]];
  return [key, entryValue];
}

export function normalizeTake(take: QueryPartnersArgs['take'] | QueryLocationsArgs['take'] | QueryRewardsArgs['take']): number {
  const fallback = 50;

  if (!take || Number.isNaN(take)) {
    return fallback;
  }

  return Math.max(0, Math.min(250, take));
}

export function distanceUnitsToDbEnum(units: DistanceUnits): 'METERS' | 'KILOMETERS' | 'MILES' {
  if (units === 'MILES') return 'MILES';
  if (units === 'KILOMETERS') return 'KILOMETERS';
  return 'METERS';
}
