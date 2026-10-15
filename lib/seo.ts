import type { Metadata } from "next";

export const SITE = "https://www.cademeupacote.com.br";
export const MARCA = "Cadê Meu Pacote";

/** Data da última revisão do conteúdo evergreen (sitemap). Atualize ao revisar textos. */
export const CONTEUDO_ATUALIZADO = "2026-10-16";

/**
 * Metadados padrão de uma página: título, descrição, endereço oficial (canonical),
 * prévia de compartilhamento (WhatsApp, redes) e indexação.
 */
export function seo(p: {
  titulo: string;
  descricao: string;
  caminho: string; // ex.: "/guias/procon-como-reclamar"
  tipo?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const url = `${SITE}${p.caminho === "/" ? "" : p.caminho}`;
  const imagem = { url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: MARCA };
  return {
    title: p.titulo,
    description: p.descricao,
    alternates: { canonical: url },
    openGraph: {
      title: p.titulo,
      description: p.descricao,
      url,
      siteName: MARCA,
      locale: "pt_BR",
      type: p.tipo ?? "website",
      images: [imagem],
    },
    twitter: { card: "summary_large_image", title: p.titulo, description: p.descricao, images: [imagem.url] },
    robots: p.noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/** JSON-LD seguro pra colocar na página (escapa "<"). */
export function jsonLd(dados: unknown): string {
  return JSON.stringify(dados).replace(/</g, "\\u003c");
}
