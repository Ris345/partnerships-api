/**
 * Produces a stable argument signature for per-argument field payload caches.
 */
export function argsSignature(args: unknown): string {
  return stableStringify(args);
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, innerValue]) => innerValue !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));

  return `{${entries.map(([key, innerValue]) => `${JSON.stringify(key)}:${stableStringify(innerValue)}`).join(',')}}`;
}
