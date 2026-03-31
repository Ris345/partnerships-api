import { GraphQLResolveInfo } from 'graphql';
import { gqlarr } from '../../model/graphql/generated/types';
import { Location } from './selectors/Location';

export const resolvers = {
  Query: {
    location: async (
      _parent: unknown,
      _args: unknown,
      _context: unknown,
      info: GraphQLResolveInfo,
    ) => {
      const locationField = gqlarr.getQueryField(info, 'location')!;

      const query = Location(locationField.fields).where(
        'id',
        '=',
        locationField.arguments.id,
      );

      console.log(query.compile().sql);

      const result = await query.executeTakeFirst();
      console.log(result);
      return result;
    },
  },
};
