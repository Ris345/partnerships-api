import { gqlarr, type AppContext } from '../../../../model/graphql';
import type { QueryPartnerCountResolver } from '../../../../model/graphql';
import {
  createCountStatement,
  createFilterExpression,
} from '../../sql/partner';

export const partnerCount: QueryPartnerCountResolver<AppContext> = async (
  _parent,
  _args,
  { timezone },
  info,
) => {
  const {
    arguments: { filter },
  } = gqlarr.getQueryField(info, 'partnerCount')!;

  const { partner_count } = await createCountStatement()
    .where(eb => createFilterExpression(eb, filter, timezone))
    .executeTakeFirstOrThrow();

  return BigInt(partner_count);
};
