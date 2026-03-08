import type { SelectQueryBuilder } from 'kysely';
import { CoordinatesBuilder } from './coordinates-builder';
import { mapLocationRow, type LocationNode } from '../mappers';

interface LocationSelection {
  coordinatesLatitude: boolean;
  coordinatesLongitude: boolean;
}

export class LocationBuilder {
  private readonly coordinatesBuilder = new CoordinatesBuilder();

  applySelect<DB, TB extends keyof DB, O>(
    query: SelectQueryBuilder<DB, TB, O>,
    selection: LocationSelection,
    alias = 'l',
  ): SelectQueryBuilder<DB, TB, O> {
    let next = query.select([`${alias}.id` as never, `${alias}.partner_id` as never]);

    next = this.coordinatesBuilder.applySelect(
      next,
      {
        latitude: selection.coordinatesLatitude,
        longitude: selection.coordinatesLongitude,
      },
      alias,
    );

    return next as SelectQueryBuilder<DB, TB, O>;
  }

  mapRow(row: {
    id: string | number;
    partner_id: number;
    latitude?: number;
    longitude?: number;
  }): LocationNode {
    return mapLocationRow(row);
  }
}
