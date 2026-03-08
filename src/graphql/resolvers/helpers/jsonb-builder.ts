import { sql, type RawBuilder } from 'kysely';

/**
 * Incrementally builds a jsonb object expression.
 */
export class JsonbObjectBuilder {
  private expression: RawBuilder<unknown> = sql`'{}'::jsonb`;

  add(key: string, valueExpression: RawBuilder<unknown>): this {
    this.expression = sql`coalesce(${this.expression}, '{}'::jsonb) || coalesce(pg_catalog.jsonb_build_object(${sql.lit(key)}, ${valueExpression})::jsonb, '{}'::jsonb)`;
    return this;
  }

  build<T>(): RawBuilder<T> {
    return this.expression as RawBuilder<T>;
  }
}
