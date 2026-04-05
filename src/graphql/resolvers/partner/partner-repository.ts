import type {
  PartnerFields,
  PartnerFilter,
  PartnerOrderByCriteria,
} from '../../../model/graphql';
import type { DB } from '../../../model/db';

import {
  Expression,
  ExpressionBuilder,
  SelectQueryBuilder,
  SqlBool,
} from 'kysely';

export class PartnerRepository {
  static count() {
    throw new Error('Not implemented');
  }

  static select(fields: PartnerFields) {
    throw new Error('Not implemented');
  }

  static filter(
    eb: ExpressionBuilder<DB, 'public.partner'>,
    filter?: PartnerFilter,
  ): Expression<SqlBool> {
    throw new Error('Not implemented');
  }

  static sort(
    qb: SelectQueryBuilder<DB, 'public.partner', any>,
    orderByClauses: PartnerOrderByCriteria[],
  ) {
    throw new Error('Not implemented');
  }
}
