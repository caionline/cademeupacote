export function formatBRL(digits: string): string {
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  if (isNaN(cents)) return "";
  const reais = Math.floor(cents / 100);
  const centavos = cents % 100;
  const reaisFormatted = reais.toLocaleString("pt-BR");
  return `R$ ${reaisFormatted},${String(centavos).padStart(2, "0")}`;
}

export function parseBRL(formatted: string): string {
  return formatted.replace(/^R\$\s*/, "");
}
