import { gqlarr, type AppContext } from '../../../../model/graphql';
import type { QueryLanguagesResolver } from '../../../../model/graphql';
import { createSelectStatement } from '../../sql/language';

export const languages: QueryLanguagesResolver<AppContext> = async (
  _parent,
  _args,
  _context,
  info,
) => {
  const { fields } = gqlarr.getQueryField(info, 'languages')!;
  return createSelectStatement(fields).execute();
};
