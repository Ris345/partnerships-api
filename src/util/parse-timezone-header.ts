export function parseTimeZoneHeader(value: string | string[] | undefined) {
  if (
    typeof value === 'string' &&
    Intl.supportedValuesOf('timeZone').includes(value)
  ) {
    return value;
  }

  return 'America/Chicago'; // Defaults to Central Time
}
