# Roadmap — Cadê Meu Pacote vira SaaS

Objetivo: receita mensal recorrente com o **Plano Pro (acompanhamento de caso)**, sem perder o plano grátis que traz tráfego.

Ordem pensada para que cada fase sirva de base para a seguinte. Atualizado em 14/10/2026.

---

## Fase 1 — Fundação: trocar Upstash Redis por Supabase
- [x] Criar o projeto no Supabase e colocar as chaves na Vercel
- [x] Tabelas: `casos` (estatística anônima), `lembretes`
- [x] Trocar `lib/kv.ts` por `lib/db.ts` com **as mesmas funções** (o resto do site não muda)
- [x] Ranking, página da loja e contador da home lendo do Supabase
- [x] Copiar os dados atuais do Redis (10 casos + 1 e-mail) — falta só cancelar o Upstash na Vercel

## Fase 2 — Login + "Meus casos"
- [x] Login sem senha (link mágico por e-mail) via Supabase Auth
- [ ] Login com Google (código pronto; falta configurar o app no Google Cloud)
- [x] Cadastro: nome, WhatsApp, CPF opcional, aceite dos termos com data
- [x] Cada reclamação gerada vira um **caso** salvo na conta: loja, problema, datas, textos gerados
- [x] Tela "Meus casos" com status (aberto / resolvido)
- [x] Usuário sem login continua usando o grátis normalmente
- [x] Configurar no Supabase: endereço do site + envio de e-mail pelo Resend (conta Resend própria, domínio verificado, modelo em português)
- [ ] Trocar as chaves do Supabase e do Resend (apareceram no chat)

## Fase 3 — Custo de IA no mínimo
- [ ] Ideias de cache do Caio (a detalhar)
- [ ] Prompt caching da Anthropic — hoje as instruções são curtas demais pro cache valer; retomar quando o prompt crescer (Pro)
- [x] Limite por dia: 5 sem conta, 15 com conta, 500 no site inteiro
- [x] Modelo: Claude Haiku 5.5 (esforço médio), escolhido em teste lado a lado com Sonnet 5.5
- [x] Custo medido: ~R$ 0,01 por reclamação (antes ~R$ 0,11 com Sonnet 4.5)
- [x] Conferir qualidade com mais casos reais (produto errado, estorno, atraso) — ok

## Fase 4 — Plano Pro: acompanhamento do caso
- [x] Oferta do Pro na tela de resultado (captura interessados + funil: visto → clique → contato)
- [x] Problema novo "A loja cancelou meu pedido" (público Copping)
- [x] Linha do tempo: SAC → Reclame Aqui → Consumidor.gov → Juizado, com prazo por etapa
- [x] Próximo texto gerado com o histórico do caso
- [x] E-mail quando o prazo vence
- [x] Painel: casos em aberto, valor em disputa, prazos vencidos
- [ ] Modelo de petição pro Juizado (antes: revisão de um advogado)
- [ ] Anexar provas ao caso (prints, nota fiscal, protocolos)
- [ ] Aviso de prazo por WhatsApp
- Preços definidos: Trimestral R$ 34,90 · Mensal R$ 14,90 · Fundador Copping R$ 9,90/mês (100 primeiros)

## Fase 5 — Pagamento
- [ ] Comparar taxas atuais de Pix e cartão (Mercado Pago, Asaas, Stripe, Pagar.me, AbacatePay…) e escolher a menor
- [ ] Assinatura mensal + compra avulsa por caso
- [ ] Liberar o Pro automaticamente ao confirmar pagamento

## Fase 6 — Divulgação
- [x] Plano completo em docs/PLANO-DIVULGACAO.md (Copping, Meta Ads, conteúdo, 30 dias)
- [x] Pixel da Meta + API de Conversões (liga quando o ID for cadastrado) e canal de origem das visitas
- [x] 10 guias de SEO em /guias (Shopee, Mercado Livre, Shein, Amazon, cancelamento, estorno, defeito, arrependimento, Consumidor.gov, Juizado)
- [x] Links de SAC das lojas revisados (Americanas, Submarino, Tok&Stok, Sephora corrigidos; Saraiva faliu; AliExpress só por chat)
- [ ] Cadastrar o site no Google Search Console e enviar o sitemap
- [ ] Começar a executar o plano de 30 dias
- [ ] Medir visitas → reclamações geradas → contas criadas

## Fase 7 — Lançamento do Pro
- [ ] Avisar a lista de espera do Pro
- [ ] Página de preços
- [ ] Acompanhar conversão grátis → Pro

---

## Já feito
- Lembrete de 7 dias por e-mail (no ar, via Resend + Supabase)
