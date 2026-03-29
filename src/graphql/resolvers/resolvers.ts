import { GraphQLResolveInfo } from 'graphql';
import { gqlarr } from '../../model/graphql/generated/types';

export const resolvers = {
  Query: {
    reward: (
      _: unknown,
      __: unknown,
      ___: unknown,
      info: GraphQLResolveInfo,
    ) => {
      console.log(JSON.stringify(info, null, 2));

      return null;
    },
  },
};
