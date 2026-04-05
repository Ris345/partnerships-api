import { gqlarr, QueryLocationsResolver } from '../../../model/graphql';
import { LocationRepository } from './location-repository';
import { clampedOrDefault } from '../../../util';
import { AppContext } from '../../../model/graphql';

export const locations: QueryLocationsResolver<AppContext> = (
  _parent,
  _args,
  _context,
  info,
) => {
  const locationsField = gqlarr.getQueryField(info, 'locations')!;

  let query = LocationRepository.select(locationsField.fields).where(eb => {
    return LocationRepository.filter(eb, locationsField.arguments.filter);
  });

  if (locationsField.arguments.orderBy) {
    query = LocationRepository.sort(query, locationsField.arguments.orderBy);
  }

  query = query.limit(
    clampedOrDefault(locationsField.arguments.take, {
      min: 0,
      max: 50,
      default: 50,
    }),
  );

  return query.execute();
};
