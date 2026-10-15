-- Pagamentos do Pro via Mercado Pago (já aplicado no projeto aolyvifrskdhdftgrbkd)
create table public.pagamentos (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  created_at       timestamptz not null default now(),
  plano            text not null check (plano in ('mensal', 'trimestral', 'fundador')),
  valor            numeric(10,2) not null,
  dias             int not null,
  status           text not null default 'pendente' check (status in ('pendente', 'aprovado', 'recusado', 'reembolsado')),
  mp_preference_id text,
  mp_payment_id    text unique,
  metodo           text,
  aprovado_em      timestamptz
);
create index pagamentos_user_idx on public.pagamentos (user_id, created_at desc);
alter table public.pagamentos enable row level security;
create policy "pagamentos: ver os seus" on public.pagamentos for select to authenticated using ((select auth.uid()) = user_id);
grant select on public.pagamentos to authenticated;

alter table public.perfis add column pro_lembrete_para timestamptz;
alter table public.perfis add column fundador boolean not null default false;

create function public.aprovar_pagamento(p_id uuid, p_mp_payment_id text, p_metodo text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare pg public.pagamentos;
begin
  select * into pg from public.pagamentos where id = p_id for update;
  if not found or pg.status = 'aprovado' then return false; end if;
  update public.pagamentos set status = 'aprovado', mp_payment_id = p_mp_payment_id, metodo = p_metodo, aprovado_em = now() where id = p_id;
  update public.perfis set pro_ate = greatest(coalesce(pro_ate, now()), now()) + make_interval(days => pg.dias) where id = pg.user_id;
  return true;
end; $$;
revoke execute on function public.aprovar_pagamento(uuid, text, text) from public, anon, authenticated;

create function public.pro_vencendo(limite int default 100)
returns table (user_id uuid, email text, nome text, pro_ate timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, u.email::text, p.nome, p.pro_ate
  from public.perfis p join auth.users u on u.id = p.id
  where p.pro_ate > now() and p.pro_ate <= now() + interval '3 days'
    and (p.pro_lembrete_para is null or p.pro_lembrete_para <> p.pro_ate)
  limit limite;
$$;
revoke execute on function public.pro_vencendo(int) from public, anon, authenticated;

create function public.reservar_fundador(p_user uuid, p_limite int default 100)
returns boolean language plpgsql security definer set search_path = '' as $$
declare ja boolean; total int;
begin
  select fundador into ja from public.perfis where id = p_user for update;
  if ja then return true; end if;
  lock table public.perfis in share row exclusive mode;
  select count(*) into total from public.perfis where fundador;
  if total >= p_limite then return false; end if;
  update public.perfis set fundador = true where id = p_user;
  return true;
end; $$;
revoke execute on function public.reservar_fundador(uuid, int) from public, anon, authenticated;
