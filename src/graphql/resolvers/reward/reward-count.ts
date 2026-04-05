import type { AppContext } from '../../../model/graphql';
import type { QueryRewardCountResolver } from '../../../model/graphql';

export const rewardCount: QueryRewardCountResolver<AppContext> = (
  _parent,
  _args,
  context,
  info,
) => {
  throw new Error('Not implemented');
};
