// Plot nullable data as separate segments, preserving gaps and all calendar positions.
export function chartPoints(
  values: (number | null)[],
  min: number,
  max: number,
): string[] {
  const segments: string[] = [];

  let current: string[] = [];

  values.forEach((value, index) => {
    if (value === null) {
      if (current.length) segments.push(current.join(" "));

      current = [];

      return;
    }

    current.push(
      `${values.length > 1 ? (index * 800) / (values.length - 1) : 400},${230 - ((value - min) / (max - min || 1)) * 210}`,
    );
  });

  if (current.length) segments.push(current.join(" "));

  return segments;
}
