import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bindPointForPostgres,
  parseGeographyPoint,
  serializeGeographyPoint,
} from '../db/point-codec';

test('parseGeographyPoint parses EWKT', () => {
  const point = parseGeographyPoint('SRID=4326;POINT(-122.4 37.8)');

  assert.equal(point.longitude, -122.4);
  assert.equal(point.latitude, 37.8);
});

test('parseGeographyPoint parses hex EWKB', () => {
  const point = parseGeographyPoint(
    '0101000020E61000000000000000000040000000000000F03F',
  );

  assert.equal(point.longitude, 2);
  assert.equal(point.latitude, 1);
});

test('serializeGeographyPoint formats EWKT', () => {
  assert.equal(
    serializeGeographyPoint({ longitude: 12.3, latitude: 45.6 }),
    'SRID=4326;POINT(12.3 45.6)',
  );
});

test('bindPointForPostgres exposes toPostgres', () => {
  const bound = bindPointForPostgres({ longitude: 1, latitude: 2 });
  assert.equal(bound.toPostgres(), 'SRID=4326;POINT(1 2)');
});
