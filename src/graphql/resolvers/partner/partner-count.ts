import type { AppContext } from '../../../model/graphql';
import type { QueryPartnerCountResolver } from '../../../model/graphql';

export const partnerCount: QueryPartnerCountResolver<AppContext> = (
  _parent,
  _args,
  context,
  info,
) => {
  throw new Error('Not implemented');
};
