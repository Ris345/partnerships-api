import test from 'node:test';
import assert from 'node:assert/strict';
import { DistanceUnits } from '../model/generated/graphql/types';
import {
  distanceUnitsToDbEnum,
  normalizeTake,
} from '../graphql/resolvers/helpers/query-builders';
import { mapRewardRow } from '../graphql/resolvers/helpers/mappers';

test('normalizeTake clamps to expected range', () => {
  assert.equal(normalizeTake(undefined), 50);
  assert.equal(normalizeTake(-10), 0);
  assert.equal(normalizeTake(9999), 250);
  assert.equal(normalizeTake(25), 25);
});

test('distanceUnitsToDbEnum maps graphql enum values', () => {
  assert.equal(distanceUnitsToDbEnum(DistanceUnits.Miles), 'MILES');
  assert.equal(distanceUnitsToDbEnum(DistanceUnits.Kilometers), 'KILOMETERS');
});

test('mapRewardRow keeps optional computed fields absent when not selected', () => {
  const mapped = mapRewardRow({
    id: 'reward-id',
    partner_id: 1,
    redemption_forums: ['ONLINE'],
    voucher_type: 'MULTIPLE_USE',
  });

  assert.equal(mapped.id, 'reward-id');
  assert.equal(mapped._meta.partnerId, 1);
  assert.deepEqual(mapped.redemptionForums, ['ONLINE']);
  assert.equal('earliestExpirationDate' in mapped._meta, false);
  assert.equal('hasUsageOrQuantityLimit' in mapped._meta, false);
  assert.equal('voucherOwnership' in mapped._meta, false);
});
