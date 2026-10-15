import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Rastreio from "./components/Rastreio";
import { META_PIXEL_ID } from "@/lib/meta";
import "./globals.css";

// Base do Pixel da Meta (sem o PageView: quem manda é o <Rastreio />, com eventID para a Conversions API).
const PIXEL_BASE = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');`;

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
        {META_PIXEL_ID && <script dangerouslySetInnerHTML={{ __html: PIXEL_BASE }} />}
      </head>
      <body>
        {children}
        <Rastreio />
        <Analytics />
      </body>
    </html>
  );
}
