import type { GraphQLResolveInfo } from 'graphql';
import type { SelectQueryBuilder } from 'kysely';
import type { VoucherOwnership } from '../../../../model/generated/graphql/types';
import {
  earliestExpirationDateExpression,
  hasUsageOrQuantityLimitExpression,
  voucherOwnershipExpression,
} from '../reward-expressions';
import { getSelectedFieldNames } from '../graphql-info';
import { mapRewardRow, type RewardNode } from '../mappers';

export interface RewardSelection {
  earliestExpirationDate: boolean;
  hasUsageOrQuantityLimit: boolean;
  voucherOwnership: boolean;
}

export class RewardBuilder {
  static fromInfo(info: GraphQLResolveInfo): RewardSelection {
    const selected = getSelectedFieldNames(info);
    return {
      earliestExpirationDate: selected.has('earliestExpirationDate'),
      hasUsageOrQuantityLimit: selected.has('hasUsageOrQuantityLimit'),
      voucherOwnership: selected.has('voucherOwnership'),
    };
  }

  applySelect<DB, TB extends keyof DB, O>(
    query: SelectQueryBuilder<DB, TB, O>,
    timezone: string,
    selection: RewardSelection,
    alias = 'r',
  ): SelectQueryBuilder<DB, TB, O> {
    let next = query.select([
      `${alias}.id` as never,
      `${alias}.partner_id` as never,
      `${alias}.redemption_forums` as never,
      `${alias}.voucher_type` as never,
    ]);

    if (selection.earliestExpirationDate) {
      next = next.select(
        earliestExpirationDateExpression(timezone, alias).as('earliest_expiration_date'),
      );
    }

    if (selection.hasUsageOrQuantityLimit) {
      next = next.select(
        hasUsageOrQuantityLimitExpression(alias).as('has_usage_or_quantity_limit'),
      );
    }

    if (selection.voucherOwnership) {
      next = next.select(voucherOwnershipExpression(alias).as('voucher_ownership'));
    }

    return next as SelectQueryBuilder<DB, TB, O>;
  }

  mapRow(row: {
    id: string;
    partner_id: number;
    redemption_forums: ('ONLINE' | 'IN_STORE')[];
    voucher_type: 'MULTIPLE_USE' | 'SINGLE_USE' | 'ON_DEMAND' | 'MANUAL';
    earliest_expiration_date?: Date | null;
    has_usage_or_quantity_limit?: boolean;
    voucher_ownership?: VoucherOwnership;
  }): RewardNode {
    return mapRewardRow(row);
  }
}
