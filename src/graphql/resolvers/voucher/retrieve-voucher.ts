import type { AppContext } from '../../../model/graphql';
import type { MutationRetrieveVoucherResolver } from '../../../model/graphql';

export const retrieveVoucher: MutationRetrieveVoucherResolver<AppContext> = (
  _parent,
  _args,
  context,
  info,
) => {
  throw new Error('Not implemented');
};
