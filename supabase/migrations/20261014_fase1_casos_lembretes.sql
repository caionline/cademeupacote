-- Fase 1: estatística anônima + lembrete de 7 dias
-- Cole tudo no SQL Editor do Supabase e clique em "Run".

-- Estatística anônima: 1 linha por reclamação gerada (sem dados pessoais)
create table public.casos (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  store_id    text not null,
  problem_id  text not null,
  value_range text
);
create index casos_created_at_idx on public.casos (created_at);
create index casos_store_created_idx on public.casos (store_id, created_at);

-- Lembrete de 7 dias por e-mail
create table public.lembretes (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  store_id    text not null,
  problem_id  text not null,
  created_at  timestamptz not null default now(),
  enviar_em   timestamptz not null,
  enviado_em  timestamptz
);
create index lembretes_pendentes_idx on public.lembretes (enviar_em) where enviado_em is null;

-- Só o servidor (chave secreta) acessa. Sem políticas = ninguém de fora lê nem escreve.
alter table public.casos     enable row level security;
alter table public.lembretes enable row level security;

-- Ranking das lojas nos últimos N dias
create function public.ranking_lojas(dias int default 30)
returns table (store_id text, total bigint, problema_mais_comum text)
language sql stable
set search_path = ''
as $$
  with c as (
    select store_id, problem_id from public.casos
    where created_at >= now() - make_interval(days => dias)
  )
  select c.store_id,
         count(*) as total,
         (select c2.problem_id from c c2
           where c2.store_id = c.store_id
           group by c2.problem_id order by count(*) desc limit 1) as problema_mais_comum
  from c
  group by c.store_id
  order by total desc;
$$;

-- Números de uma loja nos últimos N dias
create function public.stats_loja(p_store_id text, dias int default 30)
returns jsonb
language sql stable
set search_path = ''
as $$
  with c as (
    select problem_id, value_range from public.casos
    where store_id = p_store_id
      and created_at >= now() - make_interval(days => dias)
  )
  select jsonb_build_object(
    'total', (select count(*) from c),
    'porProblema', coalesce((select jsonb_object_agg(problem_id, n)
       from (select problem_id, count(*) n from c group by problem_id) x), '{}'::jsonb),
    'porValueRange', coalesce((select jsonb_object_agg(value_range, n)
       from (select value_range, count(*) n from c where value_range is not null and value_range <> '' group by value_range) y), '{}'::jsonb)
  );
$$;

revoke execute on function public.ranking_lojas(int)     from public, anon, authenticated;
revoke execute on function public.stats_loja(text, int)  from public, anon, authenticated;
