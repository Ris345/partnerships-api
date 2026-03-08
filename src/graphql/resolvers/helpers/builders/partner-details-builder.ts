import { sql, type RawBuilder } from 'kysely';
import type { PartnerDetails } from '../../../../model/generated/graphql/types';
import { JsonbObjectBuilder } from '../jsonb-builder';

export class PartnerDetailsBuilder {
  buildJsonExpression(alias = 'pdt'): RawBuilder<PartnerDetails> {
    return new JsonbObjectBuilder<PartnerDetails>()
      .add('name', sql.ref(`${alias}.name`))
      .add('logoUrl', sql.ref(`${alias}.logo_url`))
      .add('description', sql.ref(`${alias}.description`))
      .add('webAddressUrl', sql.ref(`${alias}.web_address_url`))
      .add('webAddressText', sql.ref(`${alias}.web_address_text`))
      .add('reasonForSupporting8by8', sql.ref(`${alias}.reason_for_supporting_8by8`))
      .build();
  }
}
