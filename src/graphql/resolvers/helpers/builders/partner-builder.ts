import type { SelectQueryBuilder } from 'kysely';
import { mapPartnerId, type PartnerNode } from '../mappers';

export class PartnerBuilder {
  applySelect<DB, TB extends keyof DB, O>(
    query: SelectQueryBuilder<DB, TB, O>,
    alias = 'p',
  ): SelectQueryBuilder<DB, TB, O> {
    return query.select(`${alias}.id` as never) as SelectQueryBuilder<DB, TB, O>;
  }

  mapRow(row: { id: string | number }): PartnerNode {
    return mapPartnerId(row.id);
  }
}
