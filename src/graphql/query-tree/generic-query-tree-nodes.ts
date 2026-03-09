import { QueryTreeNode } from './query-tree-extractor';

export interface GenericFieldNode<
  TName extends string,
  TArgs extends Record<string, unknown>,
  TFields extends QueryTreeNode[],
> {
  fieldName: TName;
  alias: string | undefined;
  arguments: TArgs;
  fields: TFields;
}

export interface GenericFragmentNode<
  TSubtypes extends string,
  TFields extends QueryTreeNode[],
> {
  typeCondition: TSubtypes | undefined;
  fields: TFields;
}
