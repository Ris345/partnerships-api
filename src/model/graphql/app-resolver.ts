import { IFieldResolver } from '@graphql-tools/utils';
import { AppContext } from './app-context';

export type AppResolver<T> = IFieldResolver<
  unknown,
  AppContext,
  Record<string, any>,
  T | Promise<T>
>;
