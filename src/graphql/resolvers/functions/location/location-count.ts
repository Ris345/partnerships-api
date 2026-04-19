import type { AppContext } from '../../../../model/graphql';
import { gqlarr, QueryLocationCountResolver } from '../../../../model/graphql';
import {
  createCountStatement,
  createFilterExpression,
} from '../../sql/location';

export const locationCount: QueryLocationCountResolver<AppContext> = async (
  _parent,
  _args,
  _context,
  info,
) => {
  let query = createCountStatement();

  const {
    arguments: { filter },
  } = gqlarr.getQueryField(info, 'locationCount')!;

  if (filter) {
    query = query.where(eb => createFilterExpression(eb, filter));
  }

  const result = await query.executeTakeFirstOrThrow();
  return Number(result.location_count); // going to have to add support for bigint scalars
};
