import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner">
          <div className="logo">
            <div className="logo-mark">📦</div>
            Cadê meu pacote?
          </div>
          <div className="nav-links">
            <a href="#como-funciona">Como funciona</a>
            <a href="#escalada">Escalada</a>
            <a href="#faq">FAQ</a>
            <Link href="/sobre">Sobre</Link>
            <a href="/ranking">Ranking</a>
            <Link href="/app" className="nav-cta">Resolver agora →</Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            Reclamação com força de lei
          </div>
          <h1 className="hero-title">
            A loja<br />
            <em>não cumpriu?</em><br />
            A gente desamarra.
          </h1>
          <p className="hero-sub">
            Gere uma reclamação baseada no Código de Defesa do Consumidor em 3 minutos.
            Shein, Shopee, Amazon, Magalu e mais — grátis, sem cadastro.
          </p>
          <div className="cta-row">
            <Link href="/app" className="btn btn-primary">Começar agora →</Link>
            <a href="#como-funciona" className="btn btn-ghost">Ver como funciona</a>
          </div>
          <div className="trust-line">
            <span>✓ 100% grátis</span>
            <span>✓ Sem cadastro</span>
            <span>✓ LGPD</span>
            <span>✓ Em 3 minutos</span>
          </div>
        </div>

        <div className="hero-phone">
          <div className="sticker sticker-1">em 3 min ⚡</div>
          <div className="phone">
            <div className="phone-screen">
              <div className="screen-hero-title">
                Loja não<br /><em>cumpriu?</em>
              </div>
              <div className="screen-hero-sub">A gente gera a reclamação perfeita.</div>
              <div className="screen-prob"><div className="screen-prob-icon">⏰</div><div className="screen-prob-text">Meu pedido atrasou</div></div>
              <div className="screen-prob"><div className="screen-prob-icon">📭</div><div className="screen-prob-text">Diz entregue, não recebi</div></div>
              <div className="screen-prob"><div className="screen-prob-icon">💥</div><div className="screen-prob-text">Chegou quebrado</div></div>
              <div className="screen-prob"><div className="screen-prob-icon">🔀</div><div className="screen-prob-text">Produto errado</div></div>
              <div className="screen-prob"><div className="screen-prob-icon">💸</div><div className="screen-prob-text">Não devolveram $</div></div>
            </div>
          </div>
          <div className="sticker sticker-2">CDC na veia 💪</div>
        </div>
      </header>

      <section className="stats">
        <div className="stats-inner">
          <div><div className="stat-num">3min</div><div className="stat-label">do problema à reclamação pronta</div></div>
          <div><div className="stat-num">3</div><div className="stat-label">canais cobertos no plano grátis</div></div>
          <div><div className="stat-num">R$ 0</div><div className="stat-label">custo pra começar</div></div>
          <div><div className="stat-num">CDC</div><div className="stat-label">embasamento legal real</div></div>
        </div>
      </section>

      <section className="how" id="como-funciona">
        <div className="section-kicker">Como funciona</div>
        <h2 className="section-title">Três passos. <em>Resolvido.</em></h2>
        <p className="section-sub">A gente transforma sua frustração em um texto com base no Código de Defesa do Consumidor.</p>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Conta o que rolou</h3>
            <p>Escolha a loja, o problema e os detalhes da compra. Pergunta simples, sem jargão jurídico.</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>A gente escreve</h3>
            <p>Em segundos, geramos o texto com artigos do CDC, prazos e exigências claras. Pronto pra enviar.</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Você manda</h3>
            <p>SAC da loja, Reclame Aqui, Consumidor.gov. Se enrolarem, a gente escala o caso até resolver.</p>
          </div>
        </div>
      </section>

      <section className="escalation" id="escalada">
        <div className="escalation-inner">
          <div>
            <div className="section-kicker">Escalada</div>
            <h2 className="section-title">
              Se o SAC ignorar,<br /><em>a gente aperta.</em>
            </h2>
            <p className="section-sub">Cada passo aumenta a pressão. Comece simples, escale só se precisar.</p>
            <Link href="/app" className="btn btn-primary">Gerar minha reclamação →</Link>
          </div>
          <div className="ladder">
            <div className="rung hot">
              <div className="rung-dot">1</div>
              <div>
                <div className="rung-day">Hoje</div>
                <div className="rung-title">💬 SAC da loja</div>
                <div className="rung-meta">Começa leve. Maioria dos casos resolve aqui.</div>
              </div>
            </div>
            <div className="rung">
              <div className="rung-dot">2</div>
              <div>
                <div className="rung-day">em 48h</div>
                <div className="rung-title">⚠️ Reclame Aqui</div>
                <div className="rung-meta">Lojas grandes respondem por causa do score público.</div>
              </div>
            </div>
            <div className="rung">
              <div className="rung-dot">3</div>
              <div>
                <div className="rung-day">em 5 dias</div>
                <div className="rung-title">🏛️ Consumidor.gov.br</div>
                <div className="rung-meta">Plataforma oficial do governo. Empresa cadastrada tem 10 dias.</div>
              </div>
            </div>
            <div className="rung">
              <div className="rung-dot">4</div>
              <div>
                <div className="rung-day">em 10 dias</div>
                <div className="rung-title">⚖️ Juizado Especial (JEC)</div>
                <div className="rung-meta">Sem custas até 20 salários mínimos. Sem advogado.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stores">
        <div className="section-kicker">Lojas suportadas</div>
        <h2 className="section-title">20+ lojas.<br /><em>E contando.</em></h2>
        <div className="store-grid">
          <div className="store-chip">👗 Shein</div>
          <div className="store-chip">🛒 Shopee</div>
          <div className="store-chip">📦 Amazon</div>
          <div className="store-chip">🏪 Magalu</div>
          <div className="store-chip">🛍️ Mercado Livre</div>
          <div className="store-chip">🧧 AliExpress</div>
          <div className="store-chip">📱 Casas Bahia</div>
          <div className="store-chip">👕 Renner</div>
          <div className="store-chip">👖 C&amp;A</div>
          <div className="store-chip">🏠 Americanas</div>
          <div className="store-chip">🌐 Submarino</div>
          <div className="store-chip">🛏️ Tok&amp;Stok</div>
          <div className="store-chip">🛋️ Mobly</div>
          <div className="store-chip">💄 Sephora</div>
          <div className="store-chip">💊 Drogaria SP</div>
          <div className="store-chip">🥾 Centauro</div>
          <div className="store-chip">⚽ Netshoes</div>
          <div className="store-chip">📚 Saraiva</div>
          <div className="store-chip">🎮 Kabum</div>
          <div className="store-chip">💻 Dell</div>
          <div className="store-chip">📱 Samsung</div>
          <div className="store-chip">🍎 Apple</div>
          <div className="store-chip">+ outras</div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="section-kicker">Perguntas frequentes</div>
        <h2 className="section-title" style={{ marginBottom: 40 }}>Na real, dúvidas batem.</h2>
        <details open>
          <summary>É realmente grátis?</summary>
          <p>É. Você usa tudo sem pagar nada: gerar reclamação, enviar pra SAC, Reclame Aqui e Consumidor.gov. No futuro vamos ter um plano Pro com peças prontas pro Juizado Especial — aí é opcional.</p>
        </details>
        <details>
          <summary>Preciso de CPF?</summary>
          <p>Não pra começar. Você pode gerar a reclamação só com seu nome. Mas adicionar CPF faz o texto ter mais peso jurídico.</p>
        </details>
        <details>
          <summary>Vocês guardam meus dados?</summary>
          <p>Os dados que você preenche ficam no seu navegador pra gerar o texto e somem quando você sai. Não vendemos, não compartilhamos, não mandamos spam. LGPD compliant.</p>
        </details>
        <details>
          <summary>E se a loja não responder?</summary>
          <p>A gente tem um plano de escalada: SAC → Reclame Aqui → Consumidor.gov → JEC. Cada passo aumenta a pressão.</p>
        </details>
        <details>
          <summary>Funciona pra lojas internacionais (Shein, AliExpress)?</summary>
          <p>Funciona, mas com nuances. Lojas com CNPJ brasileiro (como Shein BR e Shopee BR) são obrigadas a seguir o CDC normalmente. Para vendedores internacionais em marketplaces (alguns produtos do AliExpress, por exemplo), a reclamação ainda tem peso, mas a aplicação pode variar. Sempre vale tentar — boa parte das lojas resolve pra evitar dor de cabeça.</p>
        </details>
      </section>

      <section className="cta-band" id="resolver">
        <h2>Chega de <em>enrolação</em>.</h2>
        <p>3 minutos. Sem cadastro. Resolve hoje.</p>
        <Link href="/app" className="btn btn-primary" style={{ fontSize: 17, padding: "18px 32px" }}>
          Abrir o app agora →
        </Link>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="logo"><div className="logo-mark">📦</div>cademeupacote.com.br</div>
          <div className="footer-links">
            <a href="/sobre">Sobre</a>
            <a href="/termos">Termos</a>
            <a href="/privacidade">Privacidade</a>
            <a href="/ranking">Ranking</a>
            <a href="/contato">Contato</a>
          </div>
          <div className="footer-meta">© 2026 · feito com 🧡 e CDC</div>
        </div>
      </footer>
    </>
  );
}
