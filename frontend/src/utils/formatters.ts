/**
 * Formats a number into Indian Rupees (INR) format.
 * Examples: 1500 -> ₹1,500 | 25000 -> ₹25,000 | 100000 -> ₹1,00,000 | 10000000 -> ₹1,00,00,000
 */
export function formatINR(amount: number, options: { decimals?: boolean; sign?: boolean } = {}): string {
  if (isNaN(amount)) return '₹0';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format with Indian numbering system (en-IN)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: options.decimals ? 2 : 0,
    minimumFractionDigits: options.decimals ? 2 : 0,
  }).format(absAmount);

  const signStr = isNegative ? '- ' : options.sign ? '+ ' : '';
  return `${signStr}₹${formatted}`;
}

export function formatCompactINR(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakh`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return formatINR(amount);
}
