import type { AppContext } from '../../../model/graphql';
import type { QueryCategoriesResolver } from '../../../model/graphql';

export const categories: QueryCategoriesResolver<AppContext> = (
  _parent,
  _args,
  context,
  info,
) => {
  throw new Error('Not implemented');
};
