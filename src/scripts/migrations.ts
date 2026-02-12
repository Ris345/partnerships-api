import 'dotenv/config';
import { exec } from 'node:child_process';
import path from 'node:path';

const dbUrl = encodeURI(
  'postgresql://' +
    process.env.DB_USER +
    ':' +
    process.env.DB_PASSWORD +
    '@' +
    process.env.DB_HOST +
    ':' +
    process.env.DB_PORT +
    '/' +
    process.env.DB_NAME +
    '?sslmode=disable',
);

const migrationsDir = path.join(import.meta.dirname, '../db/migrations');

const commands = process.argv.slice(2).join(' ');

exec(
  `npx dbmate --url "${dbUrl}" --no-dump-schema --migrations-dir "${migrationsDir}" ${commands}`,
  (err, stdout) => {
    console.log(stdout);

    if (err) {
      console.log(err);
      process.exit(1);
    }
  },
);
