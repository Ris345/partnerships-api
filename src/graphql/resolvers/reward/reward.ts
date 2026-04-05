import type { AppContext } from '../../../model/graphql';
import type { QueryRewardResolver } from '../../../model/graphql';

export const reward: QueryRewardResolver<AppContext> = (
  _parent,
  _args,
  context,
  info,
) => {
  throw new Error('Not implemented');
};
