-- (já aplicado no projeto aolyvifrskdhdftgrbkd) Canal de divulgação de onde veio a visita (?ref=copping, utm_source=meta...).
-- Em waitlist_pro a coluna "origem" já guarda o lugar do site (resultado / meus_casos), por isso "canal".
alter table public.waitlist_pro  add column if not exists canal text;
alter table public.funil_eventos add column if not exists canal text;
create index if not exists funil_eventos_canal_idx on public.funil_eventos (canal, created_at);
