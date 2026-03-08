import { sql, type Expression, type RawBuilder } from 'kysely';

/**
 * Incrementally builds a typed jsonb object expression.
 */
export class JsonbObjectBuilder<TObject extends Record<string, unknown>> {
  private expression: RawBuilder<TObject> = sql`'{}'::jsonb` as RawBuilder<TObject>;

  add<TKey extends keyof TObject>(
    key: TKey,
    valueExpression: Expression<TObject[TKey]>,
  ): this {
    this.expression = sql`coalesce(${this.expression}, '{}'::jsonb) || coalesce(pg_catalog.jsonb_build_object(${sql.lit(String(key))}, ${valueExpression})::jsonb, '{}'::jsonb)` as RawBuilder<TObject>;
    return this;
  }

  build(): RawBuilder<TObject> {
    return this.expression;
  }
}
