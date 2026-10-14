-- Fase 2: login, perfil e reclamações salvas na conta (já aplicado no projeto aolyvifrskdhdftgrbkd)

-- Perfil do usuário (1 por conta)
create table public.perfis (
  id                 uuid primary key references auth.users (id) on delete cascade,
  nome               text,
  whatsapp           text,
  cpf                text,
  termos_aceitos_em  timestamptz,
  termos_versao      text,
  marketing_ok       boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Reclamações salvas na conta
create table public.reclamacoes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at    timestamptz not null default now(),
  store_id      text not null,
  store_nome    text,
  problem_id    text not null,
  produto       text,
  valor         text,
  numero_pedido text,
  dados         jsonb not null default '{}'::jsonb,
  textos        jsonb not null,
  status        text not null default 'aberto' check (status in ('aberto', 'resolvido')),
  resolvido_em  timestamptz
);
create index reclamacoes_user_created_idx on public.reclamacoes (user_id, created_at desc);

alter table public.perfis      enable row level security;
alter table public.reclamacoes enable row level security;

-- Cada pessoa só vê e mexe no que é dela
create policy "perfil: ver o seu"      on public.perfis for select to authenticated using ((select auth.uid()) = id);
create policy "perfil: editar o seu"   on public.perfis for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "reclamacoes: ver as suas"    on public.reclamacoes for select to authenticated using ((select auth.uid()) = user_id);
create policy "reclamacoes: criar as suas"  on public.reclamacoes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "reclamacoes: editar as suas" on public.reclamacoes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "reclamacoes: apagar as suas" on public.reclamacoes for delete to authenticated using ((select auth.uid()) = user_id);

grant select, update on public.perfis to authenticated;
grant select, insert, update, delete on public.reclamacoes to authenticated;

-- Cria o perfil automaticamente no primeiro login (pega o nome do Google, se houver)
create function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'));
  return new;
end;
$$;
revoke execute on function public.criar_perfil_novo_usuario() from public, anon, authenticated;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();

-- Mantém updated_at em dia
create function public.tocar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger perfis_updated_at before update on public.perfis
  for each row execute function public.tocar_updated_at();

-- Lista de espera do Plano Pro (separada dos lembretes de reclamação)
create table public.waitlist_pro (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.waitlist_pro enable row level security;
