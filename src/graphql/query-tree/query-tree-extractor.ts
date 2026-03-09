import {
  GraphQLResolveInfo,
  Kind,
  SelectionNode,
  valueFromASTUntyped,
} from 'graphql';

export interface FieldNode {
  fieldName: string;
  alias: string | undefined;
  arguments: Record<string, any>;
  fields: QueryTreeNode[];
}

export interface FragmentNode {
  typeConditionName: string | undefined;
  fields: QueryTreeNode[];
}

export type QueryTreeNode = FieldNode | FragmentNode;

export class QueryTreeExtractor {
  constructor(private info: GraphQLResolveInfo) {}

  static isFragmentNode(node: QueryTreeNode): node is FragmentNode {
    return !QueryTreeExtractor.isFieldNode(node);
  }

  static isFieldNode(node: QueryTreeNode): node is FieldNode {
    return 'fieldName' in node;
  }

  extractQueryTree(selectionNode: SelectionNode): QueryTreeNode {
    if (selectionNode.kind === Kind.FRAGMENT_SPREAD) {
      const fragment = this.info.fragments[selectionNode.name.value];
      return fragment ?
          {
            typeConditionName: fragment.typeCondition.name.value,
            fields:
              fragment.selectionSet.selections.map(node =>
                this.extractQueryTree(node),
              ) ?? [],
          }
        : {
            typeConditionName: undefined,
            fields: [],
          };
    } else if (selectionNode.kind === Kind.INLINE_FRAGMENT) {
      return {
        typeConditionName: selectionNode.typeCondition?.name.value,
        fields:
          selectionNode.selectionSet.selections.map(node =>
            this.extractQueryTree(node),
          ) ?? [],
      };
    } else {
      return {
        fieldName: selectionNode.name.value,
        alias: selectionNode.alias?.value,
        arguments: Object.fromEntries(
          selectionNode.arguments?.map(arg => [
            arg.name.value,
            valueFromASTUntyped(arg.value, this.info.variableValues),
          ]) ?? [],
        ),
        fields:
          selectionNode.selectionSet?.selections.map(node =>
            this.extractQueryTree(node),
          ) ?? [],
      };
    }
  }
}
