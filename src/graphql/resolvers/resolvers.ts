import { GraphQLResolveInfo } from 'graphql';
import { gqlarr } from '../../model/graphql/generated/types';
import { Location } from './selectors/Location';

export const resolvers = {
  Query: {
    location: (
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

      return query;
    },
  },
};
