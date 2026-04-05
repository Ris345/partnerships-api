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

export class RewardRepository {
  static count() {
    throw new Error('Not implemented');
  }

  static select(fields: RewardFields) {
    throw new Error('Not implemented');
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
