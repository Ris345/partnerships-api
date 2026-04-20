import { sql } from 'kysely';
import { db } from '../../../../db';
import { DB, pgFn } from '../../../../model/db';

export function createCountStatement(timezone: string) {
  return db
    .selectFrom(
      pgFn('public.get_available_rewards_in_timezone', [sql.val(timezone)]).as(
        'available_reward',
      ),
    )
    .select(eb => [eb.fn.countAll().as('reward_count')]);
}
