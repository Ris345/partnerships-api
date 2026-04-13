import {
  VoucherOwnership,
  type RewardFields,
  type RewardFilter,
  type RewardOrderByCriteria,
} from '../../../model/graphql';
import type { DB } from '../../../model/db';

import {
  Expression,
  ExpressionBuilder,
  SelectQueryBuilder,
  sql,
  SqlBool,
} from 'kysely';

import { db, pgFn } from '../../../db';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export class RewardQuery {
  static count() {
    return db
      .selectFrom('public.v_available_reward')
      .select(eb => [eb.fn.countAll().as('reward_count')]);
  }

  static select(fields: RewardFields, timezone: string) {
    return db.selectFrom('public.v_available_reward').select(eb => {
      return fields.map(field => {
        switch (field.name) {
          case '__typename':
            return eb.val('Reward').as(field.alias);
          case 'id':
            return eb.ref('id').as(field.alias);
          case 'redemptionForums':
            return eb.ref('redemption_forums').as(field.alias);
          case 'voucherOwnership':
            return eb
              .case()
              .when('voucher_type', '=', 'MULTIPLE_USE')
              .then(VoucherOwnership.MULTI_USER)
              .else(VoucherOwnership.SINGLE_USER)
              .end()
              .as(field.alias);
          case 'hasUsageOrQuantityLimit':
            return pgFn('public.has_usage_or_quantity_limit', [
              eb.ref('id'),
            ]).as(field.alias);
          case 'earliestExpirationDate':
            return pgFn('public.calc_earliest_expiration_date', [
              eb.ref('id'),
              eb.val(timezone),
            ]).as(field.alias);
          case 'translatedDetails':
            const { languageTag } = field.arguments;

            return jsonObjectFrom(
              eb
                .selectFrom('public.reward_details_translation')
                .select(eb => {
                  return field.fields.map(field => {
                    switch (field.name) {
                      case '__typename':
                        return eb.val('RewardDetails').as(field.alias);
                      case 'categories':
                        return pgFn('public.get_translated_reward_categories', [
                          eb.ref('public.v_available_reward.id'),
                          eb.val(languageTag),
                        ]).as(field.alias);
                      case 'shortDescription':
                        return eb
                          .ref(
                            'public.reward_details_translation.short_description',
                          )
                          .as(field.alias);
                      case 'longDescription':
                        return eb
                          .ref(
                            'public.reward_details_translation.long_description',
                          )
                          .as(field.alias);
                    }
                  });
                })
                .where(eb =>
                  eb.and([
                    eb(
                      'public.reward_details_translation.reward_id',
                      '=',
                      eb.ref('public.v_available_reward.id'),
                    ),
                    eb(
                      'public.reward_details_translation.language_tag',
                      '=',
                      languageTag,
                    ),
                  ]),
                ),
            ).as(field.alias);
          case 'partner':
            return eb.val(null).as(field.alias);
        }
      });
    });
  }

  static filter(
    eb: ExpressionBuilder<DB, 'public.v_available_reward'>,
    filter?: RewardFilter,
  ): Expression<SqlBool> {
    throw new Error('Not implemented');
  }

  static sort(
    qb: SelectQueryBuilder<DB, 'public.v_available_reward', any>,
    orderByClauses: RewardOrderByCriteria[],
  ) {
    throw new Error('Not implemented');
  }
}
