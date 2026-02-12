import 'dotenv/config';
import path from 'node:path';
import { introspeql, type IntrospeQLConfig } from 'introspeql';

const outFile = '/model/generated/db/types.ts';

const config: IntrospeQLConfig = {
  dbConnectionParams: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    database: process.env.DB_NAME,
  },
  schemas: ['public'],
  outFile: path.join(import.meta.dirname, '..' + outFile),
  tables: {
    mode: 'exclusive',
  },
  functions: {
    mode: 'exclusive',
  },
  views: {
    mode: 'exclusive',
  },
  materializedViews: {
    mode: 'exclusive',
  },
};

generateTypes();

async function generateTypes() {
  await introspeql(config);
  console.log('Type definition file created at ' + outFile);
}
