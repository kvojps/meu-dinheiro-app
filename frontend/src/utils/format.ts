export function formatCurrencyBRL(amount: number): string {
  return `R$ ${amount.toFixed(2)}`;
}

export function formatCurrencyBRLOrFallback(
  amount: number | null | undefined,
  fallback = 'Valor não definido'
): string {
  return amount ? formatCurrencyBRL(amount) : fallback;
}
