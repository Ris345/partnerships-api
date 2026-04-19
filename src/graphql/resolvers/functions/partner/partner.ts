import type { AppContext } from '../../../model/graphql';
import type { QueryPartnerResolver } from '../../../model/graphql';

export const partner: QueryPartnerResolver<AppContext> = (
  _parent,
  _args,
  context,
  info,
) => {
  throw new Error('Not implemented');
};
