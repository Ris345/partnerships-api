import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB, pgFn } from '../model/generated/db/types';

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      max: 10,
    }),
  }),
});

export { db, pgFn };
