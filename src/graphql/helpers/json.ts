import { sql, type Expression, type RawBuilder } from 'kysely';
import { pgFn } from '../../db';

type ExpressionMap<T extends Record<string, unknown>> = {
  [K in keyof T]: Expression<T[K]>;
};

export function json<T extends Record<string, unknown>>(
  fields: ExpressionMap<T>,
): RawBuilder<T> {
  const args = Object.entries(fields).flatMap(([key, val]) => {
    return [sql.val(key), val];
  });

  return pgFn('pg_catalog.jsonb_build_object', args) as RawBuilder<T>;
}
