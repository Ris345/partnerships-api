import type { Resolvers } from '../../model/graphql';

import { location, locations, locationCount } from './location';
import { partner, partners, partnerCount } from './partner';
import { reward, rewards, rewardCount, categories } from './reward';
import { retrieveVoucher } from './voucher';

export const resolvers: Resolvers = {
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
