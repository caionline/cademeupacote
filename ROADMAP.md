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
- [ ] Conferir qualidade com mais casos reais (defeito, produto errado, reembolso)

## Fase 4 — Plano Pro: acompanhamento do caso
- [ ] Linha do tempo do caso com os prazos legais (ex.: 30 dias pra loja consertar defeito, 7 dias de arrependimento, prazo de resposta no Consumidor.gov)
- [ ] Lembretes automáticos em cada prazo ("a loja não respondeu — hora de subir o tom")
- [ ] Gerar o texto do próximo canal já com o histórico do caso
- [ ] Petição pronta para o Juizado Especial Cível
- [ ] Definir preço (por caso avulso e/ou mensal)

## Fase 5 — Pagamento
- [ ] Comparar taxas atuais de Pix e cartão (Mercado Pago, Asaas, Stripe, Pagar.me, AbacatePay…) e escolher a menor
- [ ] Assinatura mensal + compra avulsa por caso
- [ ] Liberar o Pro automaticamente ao confirmar pagamento

## Fase 6 — Divulgação
- [ ] O site nunca foi divulgado: definir canais (SEO, redes sociais, grupos, conteúdo) e começar
- [ ] Medir visitas → reclamações geradas → contas criadas

## Fase 7 — Lançamento do Pro
- [ ] Avisar a lista de espera do Pro
- [ ] Página de preços
- [ ] Acompanhar conversão grátis → Pro

---

## Já feito
- Lembrete de 7 dias por e-mail (no ar, via Resend + Supabase)
