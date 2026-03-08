import { sql, type SelectQueryBuilder } from 'kysely';
import { pgFn } from '../../../../db';

interface CoordinatesSelection {
  latitude: boolean;
  longitude: boolean;
}

export class CoordinatesBuilder {
  applySelect<DB, TB extends keyof DB, O>(
    query: SelectQueryBuilder<DB, TB, O>,
    selection: CoordinatesSelection,
    alias = 'l',
  ): SelectQueryBuilder<DB, TB, O> {
    let next = query;
    const coordinatesRef = sql.ref(`${alias}.coordinates`) as never;

    if (selection.latitude) {
      next = next.select(pgFn('public.get_latitude', [coordinatesRef]).as('latitude'));
    }

    if (selection.longitude) {
      next = next.select(pgFn('public.get_longitude', [coordinatesRef]).as('longitude'));
    }

    return next as SelectQueryBuilder<DB, TB, O>;
  }
}
