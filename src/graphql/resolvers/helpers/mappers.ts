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
    translatedDetailsByArgs: Record<string, PartnerDetails>;
    locationsByArgs: Record<string, LocationNode[]>;
    locationsCountByArgs: Record<string, number>;
    rewardsByArgs: Record<string, RewardNode[]>;
    rewardsCountByArgs: Record<string, number>;
  };
};

export type LocationNode = {
  id: string;
  coordinates: Coordinates;
  distance: number;
  partner: Partner;
  _meta: {
    partnerId: number;
    distanceByArgs: Record<string, number>;
  };
};

export type RewardNode = Reward & {
  _meta: {
    partnerId: number;
    voucherType: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL';
    translatedDetailsByArgs: Record<string, RewardDetails>;
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
    _meta: {
      partnerId,
      translatedDetailsByArgs: {},
      locationsByArgs: {},
      locationsCountByArgs: {},
      rewardsByArgs: {},
      rewardsCountByArgs: {},
    },
  };
}

export function mapLocationRow(row: {
  id: string | number;
  partner_id: number;
  latitude?: number;
  longitude?: number;
}): LocationNode {
  const partner = mapPartnerId(row.partner_id);

  return {
    id: String(row.id),
    coordinates: {
      latitude: row.latitude ?? 0,
      longitude: row.longitude ?? 0,
    },
    distance: 0,
    partner,
    _meta: {
      partnerId: row.partner_id,
      distanceByArgs: {},
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
  voucher_ownership?: VoucherOwnership | 'MULTI_USER' | 'SINGLE_USER';
}): RewardNode {
  const partner = mapPartnerId(row.partner_id);
  const resolvedVoucherOwnership =
    row.voucher_ownership === 'MULTI_USER' ?
      VoucherOwnershipEnum.MultiUser
    : row.voucher_ownership === 'SINGLE_USER' ?
      VoucherOwnershipEnum.SingleUser
    : (row.voucher_ownership ?? mapVoucherOwnership(row.voucher_type));

  return {
    id: row.id,
    voucherOwnership: resolvedVoucherOwnership,
    redemptionForums: mapRedemptionForums(row.redemption_forums),
    translatedDetails: EMPTY_REWARD_DETAILS,
    hasUsageOrQuantityLimit: row.has_usage_or_quantity_limit ?? false,
    earliestExpirationDate: row.earliest_expiration_date ?? null,
    partner,
    _meta: {
      partnerId: row.partner_id,
      voucherType: row.voucher_type,
      translatedDetailsByArgs: {},
    },
  };
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
