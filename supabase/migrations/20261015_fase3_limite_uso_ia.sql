-- Fase 3: contador diário de gerações de IA (já aplicado no projeto aolyvifrskdhdftgrbkd)
create table public.uso_ia (
  chave  text not null,
  dia    date not null default (now() at time zone 'America/Sao_Paulo')::date,
  total  int  not null default 0,
  primary key (chave, dia)
);
alter table public.uso_ia enable row level security;

create function public.consumir_uso_ia(p_chave text, p_limite int, p_limite_global int)
returns text
language plpgsql
set search_path = ''
as $$
declare
  hoje   date := (now() at time zone 'America/Sao_Paulo')::date;
  pessoa int;
  global int;
begin
  insert into public.uso_ia (chave, dia, total) values (p_chave, hoje, 1)
    on conflict (chave, dia) do update set total = public.uso_ia.total + 1
    returning total into pessoa;
  if pessoa > p_limite then
    return 'pessoa';
  end if;

  insert into public.uso_ia (chave, dia, total) values ('__global__', hoje, 1)
    on conflict (chave, dia) do update set total = public.uso_ia.total + 1
    returning total into global;
  if global > p_limite_global then
    return 'global';
  end if;

  return 'ok';
end;
$$;
revoke execute on function public.consumir_uso_ia(text, int, int) from public, anon, authenticated;
