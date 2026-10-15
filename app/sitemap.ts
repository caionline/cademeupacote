import type { MetadataRoute } from "next";
import { STORES } from "@/lib/constants";
import { getTotalCasos } from "@/lib/db";
import { GUIAS } from "@/lib/guias";
import { MODELOS } from "@/lib/modelos";
import { CONTEUDO_ATUALIZADO, SITE } from "@/lib/seo";

export const revalidate = 3600;

// Datas fixas de revisão: o Google ignora "lastModified" que muda a cada visita.
const revisado = new Date(`${CONTEUDO_ATUALIZADO}T12:00:00-03:00`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let totalCasos = 0;
  try { totalCasos = await getTotalCasos(30); } catch {}

  const pagina = (caminho: string, prioridade: number, frequencia: "daily" | "weekly" | "monthly" = "monthly", data = revisado) => ({
    url: `${SITE}${caminho}`,
    lastModified: data,
    changeFrequency: frequencia,
    priority: prioridade,
  });

  return [
    pagina("", 1.0, "weekly"),
    pagina("/app", 0.9, "monthly"),
    pagina("/pro", 0.8, "monthly"),
    pagina("/guias", 0.8, "weekly"),
    ...GUIAS.map(g => pagina(`/guias/${g.slug}`, 0.8, "monthly", new Date(`${g.atualizado}T12:00:00-03:00`))),
    pagina("/modelos", 0.8, "monthly"),
    ...MODELOS.map(m => pagina(`/modelos/${m.slug}`, 0.8, "monthly")),
    pagina("/lojas", 0.7, "weekly"),
    // Todas as lojas ativas (antes só entravam as que tinham reclamação no mês).
    ...STORES.filter(s => s.id !== "other" && !s.encerrada).map(s => pagina(`/loja/${s.id}`, 0.7, "weekly")),
    pagina("/dicas", 0.6),
    pagina("/sobre", 0.5),
    // Ranking só entra quando tiver dados suficientes pra ser útil.
    ...(totalCasos >= 50 ? [pagina("/ranking", 0.6, "daily", new Date())] : []),
    pagina("/contato", 0.3),
    pagina("/termos", 0.2),
    pagina("/privacidade", 0.2),
  ];
}
