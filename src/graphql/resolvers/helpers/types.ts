import type { SortOrder } from '../../../model/generated/graphql/types';

export interface GraphQLContext {
  timezone: string;
  [key: string]: unknown;
}

export interface DbQueryOptions {
  limit?: number;
}

export function toSqlSortOrder(sortOrder: SortOrder): 'asc' | 'desc' {
  return sortOrder === 'DESC' ? 'desc' : 'asc';
}
