export type ValueRange = "ate-50" | "50-200" | "200-500" | "500-1k" | "1k-5k" | "5k+";

export function getValueRange(valorString: string): ValueRange | null {
  if (!valorString?.trim()) return null;

  let s = valorString.trim().replace(/R\$\s*/g, "").trim();

  if (s.includes(",")) {
    // Brazilian format: dots are thousands separators, comma is decimal
    s = s.replace(/\./g, "").replace(",", ".");
  }

  const value = parseFloat(s);
  if (isNaN(value) || value < 0) return null;

  if (value <= 50) return "ate-50";
  if (value <= 200) return "50-200";
  if (value <= 500) return "200-500";
  if (value <= 1000) return "500-1k";
  if (value <= 5000) return "1k-5k";
  return "5k+";
}
