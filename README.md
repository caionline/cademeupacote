# Cadê Meu Pacote? 📦

Web app que ajuda consumidores brasileiros a gerar reclamações com força de lei (baseadas no CDC) em 3 minutos. Sem cadastro, grátis.

## O que tem aqui

- Landing page (`/`) — explica o serviço
- App (`/app`) — wizard de 4 passos que coleta os dados e gera 3 textos prontos (SAC/WhatsApp, Reclame Aqui, Consumidor.gov) usando a IA da Anthropic.

## Stack

- Next.js 15 (App Router)
- TypeScript
- API da Anthropic (Claude)
- Hospedagem: Vercel

## Como rodar localmente (opcional)

```bash
npm install
cp .env.example .env.local
# edite .env.local e cole sua chave da Anthropic
npm run dev
```

Abre em http://localhost:3000

## Como fazer deploy na Vercel

1. Suba este repositório no GitHub
2. Em https://vercel.com/new, importe o repositório
3. Em **Environment Variables**, adicione:
   - `ANTHROPIC_API_KEY` = sua chave real (pega em https://console.anthropic.com)
4. Clique em **Deploy**
5. Em **Settings → Domains**, adicione `cademeupacote.com.br`
6. Configure o DNS no Registro.br conforme as instruções da Vercel

## Próximos passos (roadmap)

- [ ] Capturar e-mails opcionais e mandar lembrete em 7 dias
- [ ] Coleta anônima de "loja + tipo de problema" pra gerar dashboard de piores lojas
- [ ] Plano Pro: peça pronta pro JEC
- [ ] Histórico de casos (com cadastro)
