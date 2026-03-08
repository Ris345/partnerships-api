import type {
  ArgumentNode,
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  SelectionNode,
  ValueNode,
} from 'graphql';

export interface FieldRequest<TArgs = Record<string, unknown>> {
  args: TArgs;
  fieldNode: FieldNode;
  responseKey: string;
}

/**
 * Returns selected field names for the current resolver, excluding aliases.
 */
export function getSelectedFieldNames(info: GraphQLResolveInfo): Set<string> {
  return getSelectedFieldNamesFromFieldNodes(info.fieldNodes, info.fragments);
}

/**
 * Returns selected field names for a list of field nodes.
 */
export function getSelectedFieldNamesFromFieldNodes(
  nodes: readonly FieldNode[],
  fragmentMap: Record<string, FragmentDefinitionNode>,
): Set<string> {
  const names = new Set<string>();

  for (const node of nodes) {
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
  return getChildFieldNodesFromFieldNodes(info.fieldNodes, info.fragments, fieldName);
}

/**
 * Finds direct child field nodes by GraphQL field name for a custom parent node list.
 */
export function getChildFieldNodesFromFieldNodes(
  parentNodes: readonly FieldNode[],
  fragmentMap: Record<string, FragmentDefinitionNode>,
  fieldName: string,
): FieldNode[] {
  const nodes: FieldNode[] = [];

  for (const parentNode of parentNodes) {
    collectFieldNodes(
      parentNode.selectionSet?.selections ?? [],
      fragmentMap,
      fieldName,
      nodes,
    );
  }

  return nodes;
}

/**
 * Finds direct child field requests by GraphQL field name and resolves argument values.
 */
export function getChildFieldRequests<TArgs = Record<string, unknown>>(
  info: GraphQLResolveInfo,
  fieldName: string,
): FieldRequest<TArgs>[] {
  const nodes = getChildFieldNodes(info, fieldName);

  return getChildFieldRequestsFromFieldNodes(
    nodes,
    info.variableValues,
  );
}

/**
 * Resolves argument values for a list of field nodes.
 */
export function getChildFieldRequestsFromFieldNodes<TArgs = Record<string, unknown>>(
  nodes: readonly FieldNode[],
  variableValues: Record<string, unknown>,
): FieldRequest<TArgs>[] {
  return nodes.map(node => ({
    args: resolveArguments<TArgs>(node.arguments, variableValues),
    fieldNode: node,
    responseKey: node.alias?.value ?? node.name.value,
  }));
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

function resolveArguments<TArgs>(
  args: readonly ArgumentNode[] | undefined,
  variableValues: Record<string, unknown>,
): TArgs {
  const resolved: Record<string, unknown> = {};

  for (const arg of args ?? []) {
    resolved[arg.name.value] = resolveValue(arg.value, variableValues);
  }

  return resolved as TArgs;
}

function resolveValue(
  value: ValueNode,
  variableValues: Record<string, unknown>,
): unknown {
  switch (value.kind) {
    case 'NullValue':
      return null;
    case 'BooleanValue':
    case 'StringValue':
    case 'EnumValue':
      return value.value;
    case 'IntValue':
      return Number(value.value);
    case 'FloatValue':
      return Number(value.value);
    case 'ListValue':
      return value.values.map(item => resolveValue(item, variableValues));
    case 'ObjectValue': {
      const objectValue: Record<string, unknown> = {};
      for (const field of value.fields) {
        objectValue[field.name.value] = resolveValue(field.value, variableValues);
      }
      return objectValue;
    }
    case 'Variable':
      return variableValues[value.name.value];
    default:
      return null;
  }
}
