import { gqlarr, type AppContext } from '../../../../model/graphql';
import type { QueryRewardCountResolver } from '../../../../model/graphql';
import { createCountStatement, createFilterExpression } from '../../sql/reward';

export const rewardCount: QueryRewardCountResolver<AppContext> = async (
  _parent,
  _args,
  { timezone },
  info,
) => {
  const rewardCountField = gqlarr.getQueryField(info, 'rewardCount')!;

  const { reward_count } = await createCountStatement(timezone)
    .where(eb =>
      createFilterExpression(eb, rewardCountField.arguments.filter, timezone),
    )
    .executeTakeFirstOrThrow();

  return BigInt(reward_count);
};
