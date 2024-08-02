/**
 * Formats a cent amount to a dollar string representation.
 * @param cents - The amount in cents
 * @param options - Formatting options
 * @returns Formatted money string
 */
export function formatMoney(cents: number, options: {
  showSign?: boolean,
  showZero?: boolean,
} = {}): string {
  const { showSign = false, showZero = true } = options;
  
  if (cents === 0 && !showZero) {
    return '-';
  }

  const dollars = Math.abs(cents) / 100;
  const sign = showSign ? (cents >= 0 ? '+' : '-') : '';
  return `${sign}$${dollars.toFixed(2)}`;
}

/**
 * Converts a dollar amount to cents.
 * @param dollars - The amount in dollars
 * @returns The amount in cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Converts a cent amount to dollars.
 * @param cents - The amount in cents
 * @returns The amount in dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}