import { gqlarr, QueryLocationsResolver } from '../../../../model/graphql';
import { clampedOrDefault } from '../../../../util';
import { AppContext } from '../../../../model/graphql';
import {
  applyOrderByClause,
  createFilterExpression,
  createSelectStatement,
} from '../../sql/location';

export const locations: QueryLocationsResolver<AppContext> = (
  _parent,
  _args,
  { timezone },
  info,
) => {
  const {
    fields,
    arguments: { filter, orderBy, take },
  } = gqlarr.getQueryField(info, 'locations')!;

  return applyOrderByClause(
    createSelectStatement(fields, timezone).where(eb =>
      createFilterExpression(eb, filter, timezone),
    ),
    orderBy,
  )
    .limit(
      clampedOrDefault(take, {
        min: 0,
        max: 50,
        default: 50,
      }),
    )
    .execute();
};
