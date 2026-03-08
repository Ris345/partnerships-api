import type { Resolvers } from '../../model/generated/graphql/types';

export const resolvers: Resolvers = {
  Query: {
    partner: (parent, args, context, info) => {
      console.log(info);
      return null;
    },
  },
};
