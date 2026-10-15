import type { MetadataRoute } from "next";
import { STORES } from "@/lib/constants";
import { getStatsLoja } from "@/lib/db";
import { GUIAS } from "@/lib/guias";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://www.cademeupacote.com.br",             lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: "https://www.cademeupacote.com.br/app",         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: "https://www.cademeupacote.com.br/ranking",     lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: "https://www.cademeupacote.com.br/lojas",       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: "https://www.cademeupacote.com.br/sobre",       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.cademeupacote.com.br/dicas",       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.cademeupacote.com.br/termos",      lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://www.cademeupacote.com.br/privacidade", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://www.cademeupacote.com.br/contato",     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const activeStores = STORES.filter(s => s.id !== "other");

  const totals = await Promise.all(
    activeStores.map(s =>
      getStatsLoja(s.id, 30).then(r => r.total).catch(() => 0)
    )
  );

  const lojaPages: MetadataRoute.Sitemap = activeStores
    .filter((_, i) => totals[i] > 0)
    .map(s => ({
      url: `https://www.cademeupacote.com.br/loja/${s.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const guiaPages: MetadataRoute.Sitemap = [
    { url: "https://www.cademeupacote.com.br/guias", lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...GUIAS.map(g => ({
      url: `https://www.cademeupacote.com.br/guias/${g.slug}`,
      lastModified: new Date(`${g.atualizado}T12:00:00`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return [...staticPages, ...guiaPages, ...lojaPages];
}
