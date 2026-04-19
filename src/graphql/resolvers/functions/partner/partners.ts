import type { AppContext } from '../../../model/graphql';
import type { QueryPartnersResolver } from '../../../model/graphql';

export const partners: QueryPartnersResolver<AppContext> = (
  _parent,
  _args,
  context,
  info,
) => {
  throw new Error('Not implemented');
};
