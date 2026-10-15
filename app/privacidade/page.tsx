import Link from "next/link";
import { seo } from "@/lib/seo";

export const metadata = seo({
  titulo: "Política de Privacidade | Cadê Meu Pacote",
  descricao: "Como o Cadê Meu Pacote trata seus dados: o que coletamos, como usamos, onde fica guardado, serviços parceiros e seus direitos pela LGPD.",
  caminho: "/privacidade",
});

export default function PrivacidadePage() {
  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <div className="logo-mark">📦</div>
            Cadê meu pacote?
          </Link>
          <div className="nav-links">
            <Link href="/app" className="nav-cta">Resolver agora →</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 96px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 8 }}>
          Política de Privacidade
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 48 }}>Última atualização: 15 de outubro de 2026.</p>

        <p style={{ marginBottom: 32, lineHeight: 1.7, color: "var(--text-muted)" }}>
          Sua privacidade é prioridade. Esta política explica como tratamos seus dados.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>1. DADOS QUE COLETAMOS</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>Quando você usa o Cadê Meu Pacote, processamos:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Dados que você digita no formulário (nome, CPF opcional, detalhes da compra, problema relatado)</li>
            <li>E-mail (apenas se você optar por receber lembrete em 7 dias — totalmente opcional)</li>
          </ul>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>
            Se você <strong>criar uma conta</strong> (opcional), também guardamos:
          </p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>E-mail de acesso e, se entrar com Google, seu nome no Google</li>
            <li>Nome completo, WhatsApp e CPF (o CPF é opcional)</li>
            <li>As reclamações que você salvar: loja, problema, produto, valor, número do pedido, datas e os textos gerados. O CPF não é copiado para cada reclamação.</li>
            <li>Data e versão dos termos que você aceitou, e se quer receber novidades</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>1b. ESTATÍSTICAS ANÔNIMAS</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            Ao gerar uma reclamação, coletamos dados <strong>100% anônimos</strong> para mapear quais lojas acumulam mais reclamações e que tipos de problemas são mais frequentes. Esses dados alimentam o Ranking público de lojas do site.
          </p>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>O que coletamos de forma anônima:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Identificador da loja (ex: "shein", "amazon")</li>
            <li>Tipo de problema (ex: "pedido atrasou", "produto errado")</li>
            <li>Faixa de valor da compra (ex: "R$ 200–500") — nunca o valor exato</li>
            <li>Timestamp da reclamação</li>
          </ul>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>O que <strong>não</strong> coletamos nessa etapa:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Seu nome ou CPF</li>
            <li>O texto da reclamação gerada</li>
            <li>Seu email</li>
            <li>Qualquer dado que permita identificar você individualmente</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>2. COMO USAMOS</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Se você enviar prints da compra, as imagens vão para a API da Anthropic (Claude) só para ler os dados do pedido e preencher o formulário. Elas não ficam guardadas nos nossos servidores. Evite enviar prints com dados que não sejam da compra.</li>
            <li>Os dados do formulário são enviados à API da Anthropic (Claude) para gerar o texto da reclamação. A Anthropic não treina modelos com esses dados (configuração padrão do produto).</li>
            <li>O e-mail (se fornecido) é usado exclusivamente para enviar o lembrete acordado. Não vendemos, não compartilhamos, não usamos para spam.</li>
            <li>Os dados da conta servem para guardar e acompanhar seus casos, assinar as reclamações, avisar você sobre prazos (por e-mail ou WhatsApp) e, no futuro, preencher formulários do Consumidor.gov e do Juizado Especial a seu pedido.</li>
            <li>Só enviamos novidades e dicas se você marcar essa opção no cadastro.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>3. ARMAZENAMENTO</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Sem conta, os dados do formulário NÃO são armazenados em nossos servidores. Ficam apenas no seu navegador (localStorage) para você não perder o rascunho, e são apagados quando você limpa os dados do site.</li>
            <li>Com conta, os dados ficam no Supabase (banco de dados hospedado em São Paulo), com acesso restrito: cada pessoa só consegue ver os próprios dados.</li>
            <li>E-mails de lembrete ficam no mesmo banco e são enviados pelo Resend.</li>
            <li>Pagamentos do Pro são processados pelo Mercado Pago. Nós guardamos só o plano, o valor, a data e a situação do pagamento. Os dados do cartão ficam com o Mercado Pago e nunca passam pelos nossos servidores.</li>
            <li>Para aplicar o limite diário de uso sem conta, guardamos uma versão embaralhada (hash) do endereço IP, nunca o IP em si.</li>
            <li>Para barrar robôs, usamos o Cloudflare Turnstile, que verifica sinais do navegador (sem cookies de rastreamento) antes de gerar textos ou ler prints.</li>
            <li>Você pode apagar qualquer caso a qualquer momento em &quot;Meus casos&quot;. Para apagar a conta inteira, escreva para o e-mail abaixo.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>4. SEUS DIREITOS (LGPD)</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>Você pode solicitar a qualquer momento:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Acesso aos seus dados</li>
            <li>Correção</li>
            <li>Exclusão</li>
            <li>Portabilidade</li>
          </ul>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>
            Para exercer esses direitos, escreva para <a href="mailto:contato@cademeupacote.com.br" style={{ color: "var(--primary)" }}>contato@cademeupacote.com.br</a>.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>5. COOKIES E PIXEL DA META</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            Usamos o armazenamento local do navegador para guardar seu rascunho e, se você entrar na sua conta, um cookie de sessão para manter o login.
          </p>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>
            Também usamos o <strong>Pixel da Meta</strong> (Facebook e Instagram) e a API de Conversões da Meta para medir se nossos anúncios funcionam. Eles registram quais páginas você visitou, quando uma reclamação foi gerada, quando você clicou no Pro e quando assinou, junto com dados técnicos do navegador (endereço IP, tipo de aparelho e cookies da Meta). Quando você assina o Pro, enviamos à Meta o valor da compra e apenas uma versão embaralhada (hash) do seu e-mail, nunca o e-mail em texto. No evento de reclamação gerada vão só a loja e o tipo de problema. <strong>Nunca enviamos o texto da reclamação, seu nome, CPF, valor ou número do pedido.</strong> A Meta trata esses dados conforme a <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>política de privacidade dela</a>, e você pode limitar anúncios personalizados nas configurações de anúncios da sua conta Meta ou bloqueando cookies de terceiros no navegador.
          </p>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>
            Quando você chega por um link de divulgação (por exemplo, com <code>?ref=</code> ou <code>utm_source</code> no endereço), guardamos o nome desse canal num cookie nosso por até 90 dias, para saber de onde vêm as visitas, as reclamações e os interessados no Pro.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="logo"><div className="logo-mark">📦</div>cademeupacote.com.br</div>
          <div className="footer-links">
            <a href="/termos">Termos</a>
            <a href="/privacidade">Privacidade</a>
            <a href="/contato">Contato</a>
          </div>
          <div className="footer-meta">© {new Date().getFullYear()} · feito com 🧡 e CDC</div>
        </div>
      </footer>
    </>
  );
}
