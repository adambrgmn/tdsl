export function cx(...classNames: unknown[]): string | undefined {
  let className: string[] = [];

  for (let c of classNames) {
    if (Array.isArray(c)) {
      let result = cx(...c);
      if (result) className.push(result);
      continue;
    }

    if (typeof c === 'string' || typeof c === 'number') {
      if (c.toString().trim().length > 0) {
        className.push(c.toString().trim());
      }
      continue;
    }

    if (isStringRecord(c)) {
      for (let [key, value] of Object.entries(c)) {
        if (value) className.push(key.trim());
      }
      continue;
    }
  }

  let joined = className.join(' ');
  if (joined.length > 0) return joined;
  return undefined;
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null;
}
