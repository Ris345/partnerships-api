import { SelectQueryBuilder, sql } from 'kysely';
import { pgFn } from '../../../../db';
import { DB } from '../../../../model/db';
import { LocationOrderByCriteria, SortOrder } from '../../../../model/graphql';

export function applyOrderByClause(
  qb: SelectQueryBuilder<DB, 'public.v_active_partner_location', any>,
  orderByClauses: LocationOrderByCriteria[] = [],
) {
  return orderByClauses.reduce((builder, clause) => {
    if (clause.id) {
      return builder.orderBy(
        eb =>
          sql`${eb.ref('id')} ${sql.raw(clause.id === SortOrder.ASC ? 'asc' : 'desc')}`,
      );
    }
    if (clause.distance) {
      return builder.orderBy(
        eb =>
          sql`${eb.ref('coordinates')} <-> ${pgFn(
            'public.make_geographic_point',
            [
              eb.val(clause.distance!._from.longitude),
              eb.val(clause.distance!._from.latitude),
            ],
          )} ${sql.raw(clause.distance!._sortOrder === SortOrder.ASC ? 'asc' : 'desc')}`,
      );
    }
    if (clause.partner) {
      return builder.orderBy(eb => sql`${eb.ref('partner_id')} asc`);
    }
    return builder.orderBy(eb => sql`${eb.ref('id')} asc`);
  }, qb);
}
