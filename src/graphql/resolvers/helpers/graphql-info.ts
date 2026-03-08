import type {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  SelectionNode,
} from 'graphql';

/**
 * Returns selected field names for the current resolver, excluding aliases.
 */
export function getSelectedFieldNames(info: GraphQLResolveInfo): Set<string> {
  const fragmentMap = info.fragments;
  const names = new Set<string>();

  for (const node of info.fieldNodes) {
    collectSelectionNames(node.selectionSet?.selections ?? [], fragmentMap, names);
  }

  return names;
}

/**
 * Finds direct child field nodes by GraphQL field name.
 */
export function getChildFieldNodes(
  info: GraphQLResolveInfo,
  fieldName: string,
): FieldNode[] {
  const fragmentMap = info.fragments;
  const nodes: FieldNode[] = [];

  for (const node of info.fieldNodes) {
    collectFieldNodes(
      node.selectionSet?.selections ?? [],
      fragmentMap,
      fieldName,
      nodes,
    );
  }

  return nodes;
}

function collectSelectionNames(
  selections: readonly SelectionNode[],
  fragmentMap: Record<string, FragmentDefinitionNode>,
  output: Set<string>,
): void {
  for (const selection of selections) {
    if (selection.kind === 'Field') {
      output.add(selection.name.value);
      continue;
    }

    if (selection.kind === 'InlineFragment') {
      collectSelectionNames(selection.selectionSet.selections, fragmentMap, output);
      continue;
    }

    const fragment = fragmentMap[selection.name.value];
    if (fragment) {
      collectSelectionNames(fragment.selectionSet.selections, fragmentMap, output);
    }
  }
}

function collectFieldNodes(
  selections: readonly SelectionNode[],
  fragmentMap: Record<string, FragmentDefinitionNode>,
  targetFieldName: string,
  output: FieldNode[],
): void {
  for (const selection of selections) {
    if (selection.kind === 'Field') {
      if (selection.name.value === targetFieldName) {
        output.push(selection);
      }
      continue;
    }

    if (selection.kind === 'InlineFragment') {
      collectFieldNodes(
        selection.selectionSet.selections,
        fragmentMap,
        targetFieldName,
        output,
      );
      continue;
    }

    const fragment = fragmentMap[selection.name.value];
    if (fragment) {
      collectFieldNodes(
        fragment.selectionSet.selections,
        fragmentMap,
        targetFieldName,
        output,
      );
    }
  }
}
