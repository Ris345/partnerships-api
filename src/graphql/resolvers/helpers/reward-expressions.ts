import { sql, type RawBuilder } from 'kysely';

/**
 * Maps reward.voucher_type to GraphQL voucher ownership enum values.
 */
export function voucherOwnershipExpression(
  rewardAlias = 'r',
): RawBuilder<'MULTI_USER' | 'SINGLE_USER'> {
  return sql<'MULTI_USER' | 'SINGLE_USER'>`
    case
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'MULTIPLE_USE' then 'MULTI_USER'
      else 'SINGLE_USER'
    end
  `;
}

/**
 * Returns whether the reward is usage/quantity constrained.
 */
export function hasUsageOrQuantityLimitExpression(
  rewardAlias = 'r',
): RawBuilder<boolean> {
  return sql<boolean>`
    case
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'MULTIPLE_USE' then coalesce((
        select muv.has_usage_cap
        from public.multiple_use_voucher muv
        where muv.reward_id = ${sql.ref(`${rewardAlias}.id`)}
      ), false)
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'SINGLE_USE' then true
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'MANUAL' then exists (
        select 1
        from public.manual_voucher_stub mvs
        where mvs.reward_id = ${sql.ref(`${rewardAlias}.id`)}
          and mvs.vouchers_remaining is not null
      )
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'ON_DEMAND' then exists (
        select 1
        from public.on_demand_voucher_stub ovs
        where ovs.reward_id = ${sql.ref(`${rewardAlias}.id`)}
          and ovs.vouchers_remaining is not null
      )
      else false
    end
  `;
}

/**
 * Computes earliest expiration date for all voucher models using user timezone.
 */
export function earliestExpirationDateExpression(
  timezone: string,
  rewardAlias = 'r',
): RawBuilder<Date | null> {
  return sql<Date | null>`
    case
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'MULTIPLE_USE' then (
        select muv.redeemable_until
        from public.multiple_use_voucher muv
        where muv.reward_id = ${sql.ref(`${rewardAlias}.id`)}
      )
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'SINGLE_USE' then (
        select min(suv.redeemable_until)
        from public.single_use_voucher suv
        where suv.reward_id = ${sql.ref(`${rewardAlias}.id`)}
      )
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'MANUAL' then (
        select min(expiration_candidates.expiration)
        from (
          select mvs.redeemable_until_exact as expiration
          from public.manual_voucher_stub mvs
          where mvs.reward_id = ${sql.ref(`${rewardAlias}.id`)}

          union all

          select timezone(${timezone}, mvs.redeemable_until_local) as expiration
          from public.manual_voucher_stub mvs
          where mvs.reward_id = ${sql.ref(`${rewardAlias}.id`)}
            and mvs.redeemable_until_local is not null

          union all

          select (mvs.created_at + mvs.redeemable_for) as expiration
          from public.manual_voucher_stub mvs
          where mvs.reward_id = ${sql.ref(`${rewardAlias}.id`)}
            and mvs.redeemable_for is not null
        ) expiration_candidates
        where expiration_candidates.expiration is not null
      )
      when ${sql.ref(`${rewardAlias}.voucher_type`)} = 'ON_DEMAND' then (
        select min(expiration_candidates.expiration)
        from (
          select ovs.redeemable_until_exact as expiration
          from public.on_demand_voucher_stub ovs
          where ovs.reward_id = ${sql.ref(`${rewardAlias}.id`)}

          union all

          select timezone(${timezone}, ovs.redeemable_until_local) as expiration
          from public.on_demand_voucher_stub ovs
          where ovs.reward_id = ${sql.ref(`${rewardAlias}.id`)}
            and ovs.redeemable_until_local is not null

          union all

          select (ovs.created_at + ovs.redeemable_for) as expiration
          from public.on_demand_voucher_stub ovs
          where ovs.reward_id = ${sql.ref(`${rewardAlias}.id`)}
            and ovs.redeemable_for is not null
        ) expiration_candidates
        where expiration_candidates.expiration is not null
      )
      else null
    end
  `;
}
