import type { Resolvers } from '../../model/generated/graphql/types';
import { queryResolvers } from './query';
import { locationResolvers, partnerResolvers, rewardResolvers } from './types';

export const resolvers: Resolvers = {
  Query: queryResolvers,
  Partner: partnerResolvers as unknown as NonNullable<Resolvers['Partner']>,
  Location: locationResolvers as unknown as NonNullable<Resolvers['Location']>,
  Reward: rewardResolvers as unknown as NonNullable<Resolvers['Reward']>,
};
