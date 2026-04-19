import { SelectQueryBuilder, sql } from 'kysely';
import { pgFn } from '../../../../db';
import { RewardOrderByCriteria, SortOrder } from '../../../../model/graphql';
import { DBWithAvailableRewardTable } from './create-select-statement';

export function applyOrderByClause(
  qb: SelectQueryBuilder<DBWithAvailableRewardTable, 'available_reward', any>,
  orderByClauses: RewardOrderByCriteria[] = [],
) {
  return orderByClauses.reduce((builder, clause) => {
    if (clause.id) {
      return builder.orderBy(
        eb =>
          sql`${eb.ref('id')} ${sql.raw(clause.id === SortOrder.ASC ? 'ASC' : 'DESC')}`,
      );
    }

    if (clause.translatedDetails?._orderBy.categories) {
      return builder.orderBy(
        eb =>
          sql`${pgFn('public.get_translated_reward_categories', [
            eb.ref('id'),
            eb.val(clause.translatedDetails?._languageTag),
          ])} ${sql.raw(
            clause.translatedDetails?._orderBy.categories === SortOrder.ASC ?
              'ASC'
            : 'DESC',
          )}`,
      );
    }

    if (clause.translatedDetails?._orderBy.shortDescription) {
      return builder.orderBy(eb => {
        const shortDescriptionExpression = eb
          .selectFrom('public.reward_details_translation')
          .select('short_description')
          .where(eb =>
            eb.and([
              eb('reward_id', '=', eb.ref('available_reward.id')),
              eb(
                'language_tag',
                '=',
                eb.val(clause.translatedDetails?._languageTag),
              ),
            ]),
          )
          .limit(1);

        return sql`${shortDescriptionExpression} ${sql.raw(clause.id === SortOrder.ASC ? 'ASC' : 'DESC')}`;
      });
    }

    if (clause.translatedDetails?._orderBy.longDescription) {
      return builder.orderBy(eb => {
        const longDescriptionExpression = eb
          .selectFrom('public.reward_details_translation')
          .select('long_description')
          .where(eb =>
            eb.and([
              eb('reward_id', '=', eb.ref('available_reward.id')),
              eb(
                'language_tag',
                '=',
                eb.val(clause.translatedDetails?._languageTag),
              ),
            ]),
          )
          .limit(1);

        return sql`${longDescriptionExpression} ${sql.raw(clause.id === SortOrder.ASC ? 'ASC' : 'DESC')}`;
      });
    }

    // TODO: Implement partner order by
    if (clause.partner) {
      return builder.orderBy(eb => sql`${eb.ref('partner_id')} asc`);
    }

    return builder.orderBy(eb => sql`${eb.ref('id')} asc`);
  }, qb);
}
