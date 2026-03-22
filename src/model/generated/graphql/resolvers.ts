import { GraphQLResolveInfo } from 'graphql';
import { gqlarr } from './types';

export const resolvers = {
  Query: {
    reward: (info: GraphQLResolveInfo) => {
      const something = gqlarr.getQueryField(info, 'rewards')!;
    },
  },
};
