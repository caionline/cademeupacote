import { seo } from "@/lib/seo";

export const metadata = seo({
  titulo: "Gerar reclamação grátis contra loja online (CDC) | Cadê Meu Pacote",
  descricao: "Conte o que aconteceu (ou mande o print) e receba em 3 minutos a reclamação pronta pro SAC, Reclame Aqui, Consumidor.gov e Procon, com base no Código de Defesa do Consumidor.",
  caminho: "/app",
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
