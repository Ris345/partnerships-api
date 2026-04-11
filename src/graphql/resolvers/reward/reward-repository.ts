import type {
  RewardFields,
  RewardFilter,
  RewardOrderByCriteria,
} from '../../../model/graphql';
import type { DB } from '../../../model/db';

import {
  Expression,
  ExpressionBuilder,
  SelectQueryBuilder,
  SqlBool,
} from 'kysely';

import { db, pgFn } from '../../../db';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export class RewardRepository {
  static count() {
    return db
      .selectFrom('public.reward')
      .select(eb => [eb.fn.countAll().as('reward_count')]);
  }

  static select(fields: RewardFields) {
    return db.selectFrom('public.reward').select(eb => {
      return fields.map(field => {
        switch (field.name) {
          case '__typename':
            return eb.val('Reward').as(field.alias);
          case 'id':
            return eb.ref('id').as(field.alias);
          case 'translatedDetails':
            return jsonObjectFrom(
              eb
                .selectFrom('public.reward_details_translation')
                // just write the sql first
                .select(eb => {
                  return field.fields.map(field => {
                    switch (field.name) {
                      case '__typename':
                        return eb.val('RewardDetails').as(field.alias);
                      case 'categories':
                        // This is tricky, need to think carefully
                        return db.fn
                          .agg<string[]>('array_agg', [''])
                          .as('tag_list');
                    }
                  });
                })
                .innerJoin(
                  'public.language',
                  'public.reward_details_translation.language_code',
                  'public.language.language_code',
                )
                .innerJoin(
                  'public.reward_category',
                  'public.reward.id',
                  'public.reward_category.reward_id',
                )
                .innerJoin('public.category')
                .where(
                  'public.language.language_name',
                  '=',
                  field.arguments.languageCode,
                ),
            );
        }
      });
    });
  }

  static filter(
    eb: ExpressionBuilder<DB, 'public.reward'>,
    filter?: RewardFilter,
  ): Expression<SqlBool> {
    throw new Error('Not implemented');
  }

  static sort(
    qb: SelectQueryBuilder<DB, 'public.reward', any>,
    orderByClauses: RewardOrderByCriteria[],
  ) {
    throw new Error('Not implemented');
  }
}
