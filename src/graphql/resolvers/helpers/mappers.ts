import type {
  Coordinates,
  Partner,
  PartnerDetails,
  RedemptionForum,
  Reward,
  RewardDetails,
  VoucherOwnership,
} from '../../../model/generated/graphql/types';
import {
  RedemptionForum as RedemptionForumEnum,
  VoucherOwnership as VoucherOwnershipEnum,
} from '../../../model/generated/graphql/types';
import type { Point } from '../../../model/point';

const EMPTY_PARTNER_DETAILS: PartnerDetails = {
  name: '',
  logoUrl: '',
  description: '',
  webAddressUrl: null,
  webAddressText: null,
  reasonForSupporting8by8: null,
};

const EMPTY_REWARD_DETAILS: RewardDetails = {
  categories: [],
  shortDescription: '',
  longDescription: null,
};

export type PartnerNode = Partner & {
  _meta: {
    partnerId: number;
  };
};

export type LocationNode = {
  id: string;
  coordinates: Coordinates;
  distance: number;
  partner: Partner;
  _meta: {
    partnerId: number;
    coordinates: Point;
  };
};

export type RewardNode = Reward & {
  _meta: {
    partnerId: number;
    voucherType: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL';
    earliestExpirationDate?: Date | null;
    hasUsageOrQuantityLimit?: boolean;
    voucherOwnership?: VoucherOwnership;
  };
};

export function mapPartnerId(id: string | number): PartnerNode {
  const partnerId = Number(id);

  return {
    id: String(id),
    translatedDetails: EMPTY_PARTNER_DETAILS,
    locations: [],
    locationsCount: 0,
    rewards: [],
    rewardsCount: 0,
    _meta: { partnerId },
  };
}

export function mapLocationRow(row: {
  id: string | number;
  coordinates: Point;
  partner_id: number;
}): LocationNode {
  const partner = mapPartnerId(row.partner_id);

  return {
    id: String(row.id),
    coordinates: row.coordinates,
    distance: 0,
    partner,
    _meta: {
      partnerId: row.partner_id,
      coordinates: row.coordinates,
    },
  };
}

export function mapRewardRow(row: {
  id: string;
  partner_id: number;
  redemption_forums: ('ONLINE' | 'IN_STORE')[];
  voucher_type: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL';
  earliest_expiration_date?: Date | null;
  has_usage_or_quantity_limit?: boolean;
  voucher_ownership?: VoucherOwnership;
}): RewardNode {
  const partner = mapPartnerId(row.partner_id);

  const mapped: RewardNode = {
    id: row.id,
    voucherOwnership: row.voucher_ownership ?? mapVoucherOwnership(row.voucher_type),
    redemptionForums: mapRedemptionForums(row.redemption_forums),
    translatedDetails: EMPTY_REWARD_DETAILS,
    hasUsageOrQuantityLimit: row.has_usage_or_quantity_limit ?? false,
    earliestExpirationDate: row.earliest_expiration_date ?? null,
    partner,
    _meta: {
      partnerId: row.partner_id,
      voucherType: row.voucher_type,
    },
  };

  if (row.earliest_expiration_date !== undefined) {
    mapped._meta.earliestExpirationDate = row.earliest_expiration_date;
  }

  if (row.has_usage_or_quantity_limit !== undefined) {
    mapped._meta.hasUsageOrQuantityLimit = row.has_usage_or_quantity_limit;
  }

  if (row.voucher_ownership !== undefined) {
    mapped._meta.voucherOwnership = row.voucher_ownership;
  }

  return mapped;
}

function mapVoucherOwnership(
  voucherType: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL',
): VoucherOwnership {
  return voucherType === 'MULTIPLE_USE' ?
      VoucherOwnershipEnum.MultiUser
    : VoucherOwnershipEnum.SingleUser;
}

function mapRedemptionForums(
  forums: ('ONLINE' | 'IN_STORE')[],
): RedemptionForum[] {
  return forums.map(forum =>
    forum === 'ONLINE' ? RedemptionForumEnum.Online : RedemptionForumEnum.InStore,
  );
}
