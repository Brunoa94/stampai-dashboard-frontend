export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function stringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

// Defensive guard against malformed money, currency, and count values at external boundaries.
export function validNumericValues(value: unknown, key = ""): boolean {
  // Namespaced dictionary IDs identify evidence entries, not monetary fields.
  const isMinorField = /^[A-Za-z][A-Za-z0-9]*Minor$/.test(key);

  if (value === null) return true;

  if (typeof value === "number")
    return (
      Number.isFinite(value) &&
      (!isMinorField || Number.isSafeInteger(value)) &&
      (!["eventCount", "fractionDigits"].includes(key) ||
        (Number.isInteger(value) && value >= 0))
    );

  if (isMinorField) return false;

  if (key === "currency" && typeof value === "string")
    return /^[A-Z]{3}$/.test(value);

  if (Array.isArray(value))
    return value.every((item) => validNumericValues(item));

  if (isRecord(value))
    return Object.entries(value).every(([childKey, child]) =>
      validNumericValues(child, childKey),
    );

  return true;
}
