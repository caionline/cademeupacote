import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cademeupacote.com.br"),
  title: "Cadê meu pacote? — Reclamação com força de lei em 3 minutos",
  description:
    "Gere uma reclamação com base no Código de Defesa do Consumidor em 3 minutos. Shein, Shopee, Amazon, Magalu e mais. Grátis, sem cadastro.",
  keywords: [
    "reclamação",
    "consumidor",
    "pacote atrasado",
    "loja não entregou",
    "reclame aqui",
    "procon",
    "consumidor.gov",
    "código de defesa do consumidor",
  ],
  openGraph: {
    title: "Cadê meu pacote? — Reclamação com força de lei em 3 minutos",
    description: "Gere uma reclamação baseada no Código de Defesa do Consumidor em 3 minutos. Grátis, sem cadastro. Shein, Shopee, Amazon, Magalu e mais.",
    type: "website",
    locale: "pt_BR",
    url: "https://www.cademeupacote.com.br",
    siteName: "Cadê Meu Pacote",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cadê meu pacote?",
    description: "Reclamação com força de lei em 3 minutos. Grátis.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600;1,9..144,700&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
