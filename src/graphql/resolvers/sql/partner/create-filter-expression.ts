import { Expression, ExpressionBuilder, sql, SqlBool } from 'kysely';
import { pgFn } from '../../../../db';
import { DB } from '../../../../model/db';
import {
  PartnerDetailsFilter,
  PartnerFilter,
  RedemptionForumArrayFilter,
  RewardDetailsFilter,
  VoucherOwnership,
  VoucherOwnershipFilter,
} from '../../../../model/graphql';
import { createBooleanFilterExpression } from '../common/create-boolean-filter-expression';
import {
  createDateTimeFilterExpression,
  createIdFilterExpression,
  createStringArrayFilterExpression,
  createStringFilterExpression,
} from '../common';
import {
  availableRewardTableAlias,
  createFilterExpression as createRewardFilterStatement,
} from '../reward';

export function createFilterExpression(
  eb: ExpressionBuilder<DB, 'public.partner'>,
  filter: PartnerFilter | undefined,
  timezone: string,
): Expression<SqlBool> {
  if (filter?._and) {
    const conditions = filter._and.map(f =>
      createFilterExpression(eb, f, timezone),
    );
    return conditions.length ? eb.and(conditions) : eb.val(true);
  }

  if (filter?._or) {
    const conditions = filter._or.map(f =>
      createFilterExpression(eb, f, timezone),
    );
    return conditions.length ? eb.or(conditions) : eb.val(true);
  }

  if (filter?._not) {
    return eb.not(createFilterExpression(eb, filter._not, timezone));
  }

  if (filter?.id) {
    return createIdFilterExpression(
      eb.ref('id'),
      filter.id,
      id => sql<number>`CAST(${filter.id} AS INTEGER)`,
    );
  }

  if (filter?.translatedDetails) {
    return eb.exists(
      eb
        .selectFrom('public.partner_details_translation')
        .where(eb => eb.and([eb('partner_id', '=', eb.ref('id'))])),
    );
  }

  if (filter?.rewardCount) {
  
      eb
        .selectFrom(
          pgFn('public.get_available_rewards_in_timezone', [
            eb.val(timezone),
          ]).as(availableRewardTableAlias),
        )
        .select(eb => eb.fn.countAll().as('reward_count'))
        .where(eb =>
          createRewardFilterStatement(eb, filter.rewardCount?._filter, timezone),
        ),
  }

  return eb.val(true);
}

function createTranslatedDetailsFilterExpression(
  eb: ExpressionBuilder<DB, 'public.partner_details_translation'>,
  filter: PartnerDetailsFilter,
  languageTag: string,
): Expression<SqlBool> {
  if (filter._and) {
    const conditions = filter._and.map(f => {
      return createTranslatedDetailsFilterExpression(eb, f, languageTag);
    });

    return conditions.length ? eb.and(conditions) : eb.val(true);
  }

  if (filter._or) {
    const conditions = filter._or.map(f => {
      return createTranslatedDetailsFilterExpression(eb, f, languageTag);
    });

    return conditions.length ? eb.or(conditions) : eb.val(true);
  }

  if (filter._not) {
    return eb.not(
      createTranslatedDetailsFilterExpression(eb, filter._not, languageTag),
    );
  }

  if (filter.name) {
    return createStringFilterExpression(eb.ref('name'), filter.name);
  }

  if (filter.description) {
    return createStringFilterExpression(
      eb.ref('description'),
      filter.description,
    );
  }

  if (filter.motivation) {
    return createStringFilterExpression(
      eb.ref('reason_for_supporting_8by8'),
      filter.motivation,
    );
  }

  if (filter.webAddressUrl) {
    return createStringFilterExpression(
      eb.ref('web_address_url'),
      filter.webAddressUrl,
    );
  }

  if (filter.webAddressText) {
    return createStringFilterExpression(
      eb.ref('web_address_text'),
      filter.webAddressText,
    );
  }

  if (filter.logoUrl) {
    return createStringFilterExpression(eb.ref('logo_url'), filter.logoUrl);
  }

  return eb.val(true);
}
