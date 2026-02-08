import 'dotenv/config';
import util from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import { Client } from 'pg';
import { exec as execCB } from 'node:child_process';

const exec = util.promisify(execCB);

testDB();

async function testDB() {
  let succeeded = true;
  process.env.PGPASSWORD = process.env.TEST_DB_PASSWORD;

  const dbUrl =
    'postgresql://' +
    process.env.TEST_DB_USER +
    ':' +
    process.env.TEST_DB_PASSWORD +
    '@' +
    process.env.TEST_DB_HOST +
    ':' +
    process.env.TEST_DB_PORT +
    '/' +
    process.env.TEST_DB_NAME +
    '?sslmode=disable';

  console.log('Preparing to test database...\n');

  let output: { stdout?: string; stderr?: string } = {};

  // drop the db if it exists
  output = await exec(`npx dbmate --url "${dbUrl}" drop`);
  console.log(output.stdout);

  // recreate the database
  output = await exec(`npx dbmate --url "${dbUrl}" create`);
  console.log(output.stdout);

  // execute migrations
  const migrationsDir = path.join(__dirname, '../db/migrations');

  output = await exec(
    `npx dbmate --url "${dbUrl}" --migrations-dir "${migrationsDir}" --no-dump-schema up`,
  );
  console.log(output.stdout);

  // perform setup functions
  const client = new Client(dbUrl);
  await client.connect();

  const testsDir = path.join(__dirname, '../db/__tests__');
  const setup = fs.readFileSync(path.join(testsDir, 'setup.sql'), 'utf-8');
  await client.query(setup);

  // create the test functions
  const testFiles = fs.readdirSync(testsDir);
  for (const file of testFiles) {
    if (file.startsWith('setup') || !file.endsWith('.sql')) continue;

    const fullPath = path.join(testsDir, file);
    const contents = fs.readFileSync(fullPath, 'utf-8');
    await client.query(contents);
  }

  await client.end();

  try {
    const { stdout } = await exec(
      `PGOPTIONS='--search_path=test_override,pg_catalog,public' pg_prove --dbname ${process.env.TEST_DB_NAME} --user postgres --runtests --verbose`,
    );
    console.log(stdout);
  } catch (e: any) {
    console.log(e.stdout);
    succeeded = false;
  } finally {
    const { stdout } = await exec(`npx dbmate --url "${dbUrl}" drop`);
    console.log(stdout);
  }

  if (!succeeded) {
    process.exit(1);
  }
}
