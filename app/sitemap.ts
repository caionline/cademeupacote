import type { MetadataRoute } from "next";
import { STORES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://www.cademeupacote.com.br",             lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: "https://www.cademeupacote.com.br/app",         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: "https://www.cademeupacote.com.br/ranking",     lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: "https://www.cademeupacote.com.br/lojas",       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: "https://www.cademeupacote.com.br/sobre",       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.cademeupacote.com.br/termos",      lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://www.cademeupacote.com.br/privacidade", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://www.cademeupacote.com.br/contato",     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const lojaPages: MetadataRoute.Sitemap = STORES
    .filter(s => s.id !== "other")
    .map(s => ({
      url: `https://www.cademeupacote.com.br/loja/${s.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...lojaPages];
}
