import type { Resolvers } from '../../model/graphql';

import { DateTimeResolver, BigIntResolver } from 'graphql-scalars';
import { location, locations, locationCount } from './functions/location';
import { partner, partners, partnerCount } from './functions/partner';
import { reward, rewards, rewardCount, categories } from './functions/reward';
import { languages } from './functions/language';
import { retrieveVoucher } from './voucher';
import { GraphQLScalarType } from 'graphql';

export const resolvers: Resolvers & {
  DateTime: GraphQLScalarType<Date, Date>;
  BigInt: GraphQLScalarType<number | bigint, string | number | bigint>;
} = {
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
    languages,
  },
  Mutation: {
    retrieveVoucher,
  },
};
