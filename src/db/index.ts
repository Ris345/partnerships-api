import { Kysely, PostgresDialect } from 'kysely';
import { Pool, types } from 'pg';
import { DB, pgFn } from '../model/generated/db/types';
import { parseGeographyPoint } from './point-codec';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  database: process.env.DB_NAME,
  max: 10,
});

await registerGeographyTypeParser(pool);

const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
});

export { db, pgFn };

/**
 * Registers a geography parser so PostGIS point columns round-trip as Point.
 */
async function registerGeographyTypeParser(pgPool: Pool): Promise<void> {
  const client = await pgPool.connect();

  try {
    const result = await client.query<{ oid: number }>(
      "SELECT oid FROM pg_type WHERE typname = 'geography' LIMIT 1",
    );
    const geographyOid = result.rows[0]?.oid;

    if (!geographyOid) {
      return;
    }

    types.setTypeParser(geographyOid, value => parseGeographyPoint(value));
    types.setTypeParser(geographyOid, 'binary', value =>
      parseGeographyPoint(value),
    );
  } finally {
    client.release();
  }
}
