import 'dotenv/config';
import { Client } from 'pg';
import util from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { exec as execCB } from 'child_process';

const exec = util.promisify(execCB);

class DatabaseTests {
  private databaseUrl = this.initializeDatabaseUrl();

  constructor() {
    this.copyTestPasswordToEnvironmentVariable();
  }

  public async setUpEnvironmentAndRunTests() {
    await this.createDatabaseAndApplyMigrations();
    await this.setUpTestEnvironment();
    await this.runTests();
  }

  private initializeDatabaseUrl() {
    const databaseUrl =
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

    return databaseUrl;
  }

  private copyTestPasswordToEnvironmentVariable() {
    process.env.PGPASSWORD = process.env.TEST_DB_PASSWORD;
  }

  private async createDatabaseAndApplyMigrations() {
    let output: { stdout?: string; stderr?: string } = {};

    // drop the db if it exists
    output = await exec(`npx dbmate --url "${this.databaseUrl}" drop`);
    console.log(output.stdout);

    // recreate the database
    output = await exec(`npx dbmate --url "${this.databaseUrl}" create`);
    console.log(output.stdout);

    // execute migrations
    const migrationsDir = path.join(import.meta.dirname, '../db/migrations');

    output = await exec(
      `npx dbmate --url "${this.databaseUrl}" --migrations-dir "${migrationsDir}" --no-dump-schema up`,
    );
    console.log(output.stdout);
  }

  private async setUpTestEnvironment() {
    const client = new Client(this.databaseUrl);
    await client.connect();

    const testsDir = path.join(import.meta.dirname, '../db/__tests__');
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
  }

  private async runTests() {
    let succeeded = true;

    try {
      const { stdout } = await exec(this.runTestsCommand);
      console.log(stdout);
    } catch (e: any) {
      console.error(e.stdout);
      succeeded = false;
    } finally {
      const { stdout } = await exec(
        `npx dbmate --url "${this.databaseUrl}" drop`,
      );
      console.log(stdout);
    }

    if (!succeeded) {
      process.exit(1);
    }
  }

  private get runTestsCommand() {
    const pgOptions = '--search_path=testing,pg_catalog,public';
    const setPGOptionsCommand =
      this.isWindows() ?
        `set PGOPTIONS='${pgOptions}' &&`
      : `PGOPTIONS='${pgOptions}'`;

    const runTestsCommand = `${setPGOptionsCommand} pg_prove -h ${process.env.TEST_DB_HOST} -p ${process.env.TEST_DB_PORT} -d ${process.env.TEST_DB_NAME} -U ${process.env.TEST_DB_USER} --runtests --verbose`;
    return runTestsCommand;
  }

  private isWindows() {
    return os.platform() === 'win32';
  }
}

new DatabaseTests().setUpEnvironmentAndRunTests();
