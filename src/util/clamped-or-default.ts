interface ClampedOrDefaultOpts {
  min: number;
  max: number;
  default: number;
}

export function clampedOrDefault(
  value: number | undefined,
  opts: ClampedOrDefaultOpts,
) {
  if (opts.min > opts.max) throw new Error('Min cannot be greater than max.');
  if (opts.default < opts.min || opts.default > opts.max)
    throw new Error('Default must be >= min and <= max.');

  if (value === undefined) value = opts.default;

  return Math.min(Math.max(value, opts.min), opts.max);
}
