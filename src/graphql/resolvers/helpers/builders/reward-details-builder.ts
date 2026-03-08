import { sql, type RawBuilder } from 'kysely';
import type { RewardDetails } from '../../../../model/generated/graphql/types';
import { JsonbObjectBuilder } from '../jsonb-builder';

export class RewardDetailsBuilder {
  buildJsonExpression(alias = 'rdt'): RawBuilder<Omit<RewardDetails, 'categories'>> {
    return new JsonbObjectBuilder<Omit<RewardDetails, 'categories'>>()
      .add('shortDescription', sql.ref(`${alias}.short_description`))
      .add('longDescription', sql.ref(`${alias}.long_description`))
      .build();
  }
}
