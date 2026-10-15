-- Pro: linha do tempo do caso (já aplicado no projeto aolyvifrskdhdftgrbkd)
alter table public.perfis add column pro_ate timestamptz;

alter table public.reclamacoes
  add column etapa         text not null default 'sac' check (etapa in ('sac', 'reclameaqui', 'consumidorgov', 'jec')),
  add column enviado_em    timestamptz,
  add column prazo_em      timestamptz,
  add column prazo_avisado boolean not null default false;
create index reclamacoes_prazo_idx on public.reclamacoes (prazo_em) where status = 'aberto' and prazo_avisado = false;

create table public.caso_eventos (
  id         bigint generated always as identity primary key,
  caso_id    uuid not null references public.reclamacoes (id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  tipo       text not null check (tipo in ('enviado', 'resolvido', 'nao_resolveu', 'reaberto', 'texto_gerado', 'prazo_vencido')),
  etapa      text not null,
  nota       text
);
create index caso_eventos_caso_idx on public.caso_eventos (caso_id, created_at);
alter table public.caso_eventos enable row level security;
create policy "eventos: ver os seus"   on public.caso_eventos for select to authenticated using ((select auth.uid()) = user_id);
create policy "eventos: criar os seus" on public.caso_eventos for insert to authenticated
  with check ((select auth.uid()) = user_id and exists (select 1 from public.reclamacoes r where r.id = caso_id and r.user_id = (select auth.uid())));
grant select, insert on public.caso_eventos to authenticated;

-- O usuário não pode se dar Pro sozinho: só os campos do cadastro são editáveis.
revoke update on public.perfis from authenticated;
grant update (nome, whatsapp, cpf, termos_aceitos_em, termos_versao, marketing_ok) on public.perfis to authenticated;

create function public.casos_com_prazo_vencido(limite int default 100)
returns table (caso_id uuid, user_id uuid, email text, nome text, store_id text, store_nome text, problem_id text, etapa text)
language sql stable
security definer
set search_path = ''
as $$
  select r.id, r.user_id, u.email::text, p.nome, r.store_id, r.store_nome, r.problem_id, r.etapa
  from public.reclamacoes r
  join auth.users u on u.id = r.user_id
  join public.perfis p on p.id = r.user_id
  where r.status = 'aberto'
    and r.prazo_avisado = false
    and r.prazo_em <= now()
    and p.pro_ate > now()
  order by r.prazo_em
  limit limite;
$$;
revoke execute on function public.casos_com_prazo_vencido(int) from public, anon, authenticated;
