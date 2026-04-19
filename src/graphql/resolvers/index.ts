import type { Resolvers } from '../../model/graphql';

import { DateTimeResolver, BigIntResolver } from 'graphql-scalars';
import { location, locations, locationCount } from './functions/location';
import { partner, partners, partnerCount } from './functions/partner';
import { reward, rewards, rewardCount, categories } from './functions/reward';
import { retrieveVoucher } from './voucher';

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  BigInt: BigIntResolver,
  Query: {
    location,
    locations,
    locationCount,
    partner,
    partners,
    partnerCount,
    reward,
    rewards,
    rewardCount,
    categories,
  },
  Mutation: {
    retrieveVoucher,
  },
};
