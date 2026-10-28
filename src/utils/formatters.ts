/**
 * Indian Rupee & Financial Formatters for AICTE KOSH-Rakshak
 */

export function formatInr(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const isNegative = amount < 0;
  const absVal = Math.abs(Math.round(amount));
  
  const str = absVal.toString();
  let result = '';
  
  if (str.length <= 3) {
    result = str;
  } else {
    const last3 = str.substring(str.length - 3);
    const otherDigits = str.substring(0, str.length - 3);
    const withCommas = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = withCommas + ',' + last3;
  }
  
  return (isNegative ? '-₹' : '₹') + result;
}

export function formatCrores(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0.00 Cr';
  const inCrores = amount / 10000000;
  return `₹${inCrores.toFixed(2)} Cr`;
}

export function formatLakhs(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0.00 L';
  const inLakhs = amount / 100000;
  return `₹${inLakhs.toFixed(2)} Lakhs`;
}

/**
 * Indian Banking Quarterly Compounding Formula:
 * A = P * (1 + r / 400)^(4 * n)
 * where:
 * P = Principal amount
 * r = Annual interest rate in percent
 * n = Tenure in years
 * (4 * n) = Total compounding quarters
 */
export function calculateQuarterlyCompoundedMaturity(principal: number, annualRatePct: number, tenureYears: number): number {
  if (principal <= 0 || annualRatePct <= 0 || tenureYears <= 0) return principal;
  const ratePerQuarter = annualRatePct / 400;
  const totalQuarters = 4 * tenureYears;
  const compoundFactor = Math.pow(1 + ratePerQuarter, totalQuarters);
  return Math.round(principal * compoundFactor);
}

/**
 * Calculates day difference from a reference date
 */
export function getDaysRemaining(targetDateStr: string, simulatedDateStr: string): number {
  const target = new Date(targetDateStr);
  const current = new Date(simulatedDateStr);
  const diffTime = target.getTime() - current.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date in Indian Official style: DD-MMM-YYYY (e.g., 26-Oct-2026)
 */
export function formatGovDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Cryptographic SHA-256 Hasher
 */
export async function calculateSha256(message: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Deterministic fallback hash for SSR or edge environments
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return 'sha256_mock_' + Math.abs(hash).toString(16).padStart(16, '0');
}
