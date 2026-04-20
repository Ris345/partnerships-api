import { sql } from 'kysely';
import { gqlarr, type AppContext } from '../../../../model/graphql';
import type { QueryPartnerResolver } from '../../../../model/graphql';
import { createSelectStatement } from '../../sql/partner';

export const partner: QueryPartnerResolver<AppContext> = (
  _parent,
  _args,
  { timezone },
  info,
) => {
  const {
    fields,
    arguments: { id },
  } = gqlarr.getQueryField(info, 'partner')!;
  return createSelectStatement(fields, timezone)
    .where('id', '=', sql<number>`CAST(${id} AS INTEGER)`)
    .executeTakeFirst();
};
