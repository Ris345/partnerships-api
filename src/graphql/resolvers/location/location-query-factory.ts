import {
  Expression,
  ExpressionBuilder,
  SelectQueryBuilder,
  sql,
  SqlBool,
} from 'kysely';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { db, pgFn } from '../../../db';
import {
  LocationFields,
  LocationFilter,
  LocationOrderByCriteria,
  SortOrder,
} from '../../../model/graphql/generated/types';
import { DB } from '../../../model/db/generated/types';

export class LocationQueryFactory {
  static createCountStatement() {
    return db
      .selectFrom('public.location')
      .select(({ eb }) => [eb.fn.countAll().as('locations_count')]);
  }

  static createSelectStatement(fields: LocationFields) {
    return db.selectFrom('public.location').select(({ eb }) => {
      return fields.map(field => {
        switch (field.name) {
          case '__typename':
            return eb.val('Location').as(field.alias);
          case 'id':
            return sql<string>`CAST(${eb.ref('id')} AS VARCHAR)`.as(
              field.alias,
            );
          case 'coordinates':
            return jsonBuildObject(
              Object.fromEntries(
                field.fields.map(coordsField => {
                  switch (coordsField.name) {
                    case '__typename':
                      return [coordsField.alias, eb.val('Coordinates')];
                    case 'latitude':
                      return [
                        coordsField.alias,
                        pgFn('public.get_latitude', [eb.ref('coordinates')]),
                      ];
                    case 'longitude':
                      return [
                        coordsField.alias,
                        pgFn('public.get_longitude', [eb.ref('coordinates')]),
                      ];
                  }
                }),
              ),
            ).as(field.alias);
          case 'distance':
            return pgFn('public.calc_distance_with_units', [
              pgFn('public.make_geographic_point', [
                eb.val(field.arguments.from.longitude),
                eb.val(field.arguments.from.latitude),
              ]),
              eb.ref('coordinates'),
              eb.val(field.arguments.units),
            ]).as(field.alias);
          case 'partner':
            return eb.val(null).as(field.alias);
        }
      });
    });
  }

  static createWhereCondition(
    eb: ExpressionBuilder<DB, 'public.location'>,
    filter?: LocationFilter,
  ): Expression<SqlBool> {
    if (filter?._and) {
      const conditions = filter._and.map(f =>
        LocationQueryFactory.createWhereCondition(eb, f),
      );
      return conditions.length ? eb.and(conditions) : eb.val(true);
    }

    if (filter?._or) {
      const conditions = filter._or.map(f =>
        LocationQueryFactory.createWhereCondition(eb, f),
      );
      return conditions.length ? eb.or(conditions) : eb.val(true);
    }

    if (filter?._not) {
      return eb.not(LocationQueryFactory.createWhereCondition(eb, filter._not));
    }

    if (filter?.id?._eq) {
      return eb('id', '=', sql<bigint>`CAST(${filter.id._eq} AS BIGINT)`);
    }

    if (filter?.id?._gt) {
      return eb('id', '>', sql<bigint>`CAST(${filter.id._gt} AS BIGINT)`);
    }

    if (filter?.id?._gte) {
      return eb('id', '>=', sql<bigint>`CAST(${filter.id._gte} AS BIGINT)`);
    }

    if (filter?.id?._lt) {
      return eb('id', '<', sql<bigint>`CAST(${filter.id._lt} AS BIGINT)`);
    }

    if (filter?.id?._lte) {
      return eb('id', '<=', sql<bigint>`CAST(${filter.id._lte} AS BIGINT)`);
    }

    if (filter?.id?._neq) {
      return eb('id', '!=', sql<bigint>`CAST(${filter.id._neq} AS BIGINT)`);
    }

    if (filter?.id?._containedBy) {
      return eb(
        'id',
        'in',
        filter.id._containedBy.map(id => sql<bigint>`CAST(${id} AS BIGINT)`),
      );
    }

    if (filter?.partner) {
      // use the partner builder to create a select exists? or something...will need to figure this out
      return eb.val(true);
    }

    if (filter?.distance?._within) {
      return pgFn('public.st_dwithin', [
        eb.ref('coordinates'),
        pgFn('public.make_geographic_point', [
          eb.val(filter.distance._within._from.longitude),
          eb.val(filter.distance._within._from.latitude),
        ]),
        pgFn('public.convert_distance', [
          eb.val(filter.distance._within._radius),
          eb.val(filter.distance._within._units),
          eb.val('METERS' as const),
        ]),
        eb.val(true),
      ]);
    }

    // Catch-all
    return eb.val(true);
  }

  static withOrderBy(
    qb: SelectQueryBuilder<DB, 'public.location', any>,
    orderByClauses: LocationOrderByCriteria[],
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
}
