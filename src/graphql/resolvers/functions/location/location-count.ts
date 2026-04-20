import type { AppContext } from '../../../../model/graphql';
import { gqlarr, QueryLocationCountResolver } from '../../../../model/graphql';
import {
  createCountStatement,
  createFilterExpression,
} from '../../sql/location';

export const locationCount: QueryLocationCountResolver<AppContext> = async (
  _parent,
  _args,
  { timezone },
  info,
) => {
  const {
    arguments: { filter },
  } = gqlarr.getQueryField(info, 'locationCount')!;

  const query = createCountStatement().where(eb =>
    createFilterExpression(eb, filter, timezone),
  );

  const result = await query.executeTakeFirstOrThrow();
  return BigInt(result.location_count);
};
