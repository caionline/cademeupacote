-- Oferta do Pro na tela de resultado (já aplicado no projeto aolyvifrskdhdftgrbkd)
alter table public.waitlist_pro
  add column plano      text check (plano in ('mensal', 'trimestral')),
  add column user_id    uuid references auth.users (id) on delete set null,
  add column store_id   text,
  add column problem_id text,
  add column origem     text not null default 'home';

create table public.funil_eventos (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  tipo       text not null check (tipo in ('resultado_visto', 'oferta_clicada', 'oferta_lead')),
  problem_id text,
  store_id   text,
  logado     boolean not null default false
);
create index funil_eventos_created_idx on public.funil_eventos (created_at);
alter table public.funil_eventos enable row level security;
