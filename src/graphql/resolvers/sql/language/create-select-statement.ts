import { db } from '../../../../db';
import { LanguageFields } from '../../../../model/graphql';

export function createSelectStatement(fields: LanguageFields) {
  return db.selectFrom('public.language').select(eb => {
    return fields.map(field => {
      switch (field.name) {
        case '__typename':
          return eb.val('Language').as(field.alias);
        case 'languageTag':
          return eb.ref('language_tag').as(field.alias);
        case 'languageNameEn':
          return eb.ref('language_name_en').as(field.alias);
        case 'languageNameNative':
          return eb.ref('language_name_native').as(field.alias);
      }
    });
  });
}
