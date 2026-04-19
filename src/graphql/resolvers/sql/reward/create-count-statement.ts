import { sql } from 'kysely';
import { db } from '../../../../db';
import { DB, pgFn } from '../../../../model/db';

export function createCountStatement(timezone: string) {
  return db
    .selectFrom(
      sql<
        DB['public.reward']
      >`get_available_rewards_in_timezone(${timezone})`.as('available_reward'),
    )
    .select(eb => [eb.fn.countAll().as('reward_count')]);
}
