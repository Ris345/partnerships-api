import type { Point } from '../model/point';

/**
 * PostGIS geography SRID used by the schema.
 */
const GEOGRAPHY_SRID = 4326;

const WKT_POINT_PATTERN = /^(?:SRID=\d+;)?POINT\((-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)\)$/i;

/**
 * Parses PostGIS geography output into an application Point.
 */
export function parseGeographyPoint(value: string | Buffer): Point {
  if (Buffer.isBuffer(value)) {
    return parseEwkbPoint(value);
  }

  const trimmed = value.trim();

  if (trimmed.startsWith('\\x')) {
    return parseEwkbPoint(Buffer.from(trimmed.slice(2), 'hex'));
  }

  if (/^[0-9a-fA-F]+$/.test(trimmed)) {
    return parseEwkbPoint(Buffer.from(trimmed, 'hex'));
  }

  const match = WKT_POINT_PATTERN.exec(trimmed);
  if (!match) {
    throw new Error(`Unsupported geography point format: ${value}`);
  }

  return {
    longitude: Number(match[1]),
    latitude: Number(match[2]),
  };
}

/**
 * Serializes a Point to EWKT that PostgreSQL can cast to geography.
 */
export function serializeGeographyPoint(point: Point): string {
  return `SRID=${GEOGRAPHY_SRID};POINT(${point.longitude} ${point.latitude})`;
}

/**
 * Adds a toPostgres method so node-postgres can serialize Point values.
 */
export function bindPointForPostgres(point: Point): Point & { toPostgres(): string } {
  return {
    ...point,
    toPostgres() {
      return serializeGeographyPoint(point);
    },
  };
}

function parseEwkbPoint(buffer: Buffer): Point {
  const littleEndian = buffer.readUInt8(0) === 1;
  const typeWithFlags =
    littleEndian ? buffer.readUInt32LE(1) : buffer.readUInt32BE(1);

  const hasSrid = (typeWithFlags & 0x20000000) !== 0;
  const geometryType = typeWithFlags & 0xff;

  if (geometryType !== 1) {
    throw new Error(`Unsupported EWKB geometry type: ${geometryType}`);
  }

  let offset = 5;
  if (hasSrid) {
    offset += 4;
  }

  const longitude = littleEndian ? buffer.readDoubleLE(offset) : buffer.readDoubleBE(offset);
  const latitude = littleEndian ? buffer.readDoubleLE(offset + 8) : buffer.readDoubleBE(offset + 8);

  return { latitude, longitude };
}
