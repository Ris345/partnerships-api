import type { AppContext } from '../../../model/graphql';
import type { QueryRewardsResolver } from '../../../model/graphql';

export const rewards: QueryRewardsResolver<AppContext> = (
  _parent,
  _args,
  context,
  info,
) => {
  throw new Error('Not implemented');
};
