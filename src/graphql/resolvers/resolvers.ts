import { GraphQLResolveInfo } from 'graphql';
import { gqlarr } from '../../model/graphql/generated/types';

export const resolvers = {
  Query: {
    reward: (
      _parent: unknown,
      _args: unknown,
      _context: unknown,
      info: GraphQLResolveInfo,
    ) => {
      console.log(JSON.stringify(info, null, 2));

      return null;
    },
  },
};
