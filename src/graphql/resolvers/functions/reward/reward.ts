import { gqlarr, type AppContext } from '../../../../model/graphql';
import type { QueryRewardResolver } from '../../../../model/graphql';
import { createSelectStatement } from '../../sql/reward';

export const reward: QueryRewardResolver<AppContext> = (
  _parent,
  _args,
  { timezone },
  info,
) => {
  const {
    fields,
    arguments: { id },
  } = gqlarr.getQueryField(info, 'reward')!;

  return createSelectStatement(fields, timezone)
    .where('id', '=', id)
    .executeTakeFirst();
};
