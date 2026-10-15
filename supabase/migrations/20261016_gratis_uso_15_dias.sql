-- Reclamação grátis: 1 a cada 15 dias por conta/aparelho (já aplicado no projeto aolyvifrskdhdftgrbkd)
create table public.gratis_uso (
  chave  text primary key,
  ultimo timestamptz not null default now()
);
alter table public.gratis_uso enable row level security;

create function public.reservar_gratis(p_chaves text[], p_dias int)
returns timestamptz
language plpgsql
set search_path = ''
as $$
declare
  k text;
  bloqueado timestamptz;
begin
  for k in select distinct unnest(p_chaves) order by 1 loop
    perform pg_advisory_xact_lock(hashtext(k));
  end loop;

  select max(ultimo) + make_interval(days => p_dias) into bloqueado
    from public.gratis_uso
   where chave = any(p_chaves)
     and ultimo > now() - make_interval(days => p_dias);

  if bloqueado is not null then
    return bloqueado;
  end if;

  insert into public.gratis_uso (chave, ultimo)
    select distinct unnest(p_chaves), now()
  on conflict (chave) do update set ultimo = now();
  return null;
end;
$$;

create function public.liberar_gratis(p_chaves text[])
returns void
language sql
set search_path = ''
as $$
  delete from public.gratis_uso where chave = any(p_chaves);
$$;

revoke execute on function public.reservar_gratis(text[], int) from public, anon, authenticated;
revoke execute on function public.liberar_gratis(text[]) from public, anon, authenticated;
