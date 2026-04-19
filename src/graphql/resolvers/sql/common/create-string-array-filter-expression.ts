import { type Expression, sql } from 'kysely';
import type { StringArrayFilter } from '../../../../model/graphql';

export function createStringArrayFilterExpression(
  lhs: Expression<string[] | null>,
  filter: StringArrayFilter,
): Expression<boolean> {
  if (filter._eq) {
    return sql<boolean>`array_sort(${lhs}) = array_sort(${filter._eq})`;
  }

  if (filter._eq === null) {
    return sql<boolean>`${lhs} IS NULL`;
  }

  if (filter._neq) {
    return sql<boolean>`array_sort(${lhs}) != array_sort(${filter._neq})`;
  }

  if (filter._neq === null) {
    return sql<boolean>`${lhs} IS NOT NULL`;
  }

  if (filter._containsEl) {
    return sql<boolean>`${filter._containsEl} = ANY(${lhs})`;
  }

  if (filter._containsArr) {
    return sql<boolean>`${lhs} @> ${filter._containsArr}`;
  }

  if (filter._containedBy) {
    return sql<boolean>`${lhs} <@ ${filter._containedBy}`;
  }

  if (filter._overlaps) {
    return sql<boolean>`${lhs} && ${filter._overlaps}`;
  }

  // Default for when filter is an empty object
  return sql.val(true);
}
