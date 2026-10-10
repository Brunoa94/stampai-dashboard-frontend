export function numberLabel(value: number | null | undefined): string {
  return value == null
    ? "Unavailable"
    : new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);
}

export function money(
  value: number | null | undefined,
  currency: string | null,
  fractionDigits?: number,
): string {
  if (value == null) return "Unavailable";

  if (!currency) return `${numberLabel(value)} · currency unknown`;

  const formatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    ...(fractionDigits !== undefined
      ? {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        }
      : {}),
  });

  const digits =
    fractionDigits ?? formatter.resolvedOptions().maximumFractionDigits ?? 2;

  return formatter.format(value / 10 ** digits);
}

export function majorMoney(
  value: number | null,
  currency: string | null,
): string {
  if (value == null) return "Unavailable";

  return currency
    ? new Intl.NumberFormat("en", { style: "currency", currency }).format(value)
    : `${numberLabel(value)} · currency unknown`;
}
