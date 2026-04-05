import 'dotenv/config';
import pg, { Client } from 'pg';
import * as wkx from 'wkx';
import { Point } from '../model/db/point';

export async function setCustomTypeParsers() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await client.connect();

  // Get the OID for geography types
  const { rows } = await client.query(`
    SELECT oid FROM pg_type WHERE typname = 'geography'
  `);

  // Set the geography type parser to parse geographies as Point
  for (const row of rows) {
    pg.types.setTypeParser(row.oid, hex => {
      const geom = wkx.Geometry.parse(Buffer.from(hex, 'hex')) as wkx.Point;
      return new Point(geom.y, geom.x);
    });
  }

  // Set the bigint type parser
  pg.types.setTypeParser(20, val => BigInt(val));

  // Convert bigints to string for JSON serialization
  Object.defineProperty(BigInt.prototype, 'toJSON', {
    value: function () {
      return this.toString();
    },
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
