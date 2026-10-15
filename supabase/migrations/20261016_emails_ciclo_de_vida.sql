-- E-mails do ciclo de vida (já aplicado no projeto aolyvifrskdhdftgrbkd)
alter table public.pagamentos add column lembrete_enviado_em timestamptz;
alter table public.perfis add column pro_expirou_aviso_para timestamptz;
alter table public.perfis add column boas_vindas_em timestamptz;

create function public.pagamentos_abandonados(limite int default 100)
returns table (pagamento_id uuid, user_id uuid, email text, nome text, plano text)
language sql stable security definer set search_path = '' as $$
  select pg.id, pg.user_id, u.email::text, p.nome, pg.plano
  from public.pagamentos pg
  join auth.users u on u.id = pg.user_id
  join public.perfis p on p.id = pg.user_id
  where pg.status = 'pendente' and pg.lembrete_enviado_em is null
    and pg.created_at <= now() - interval '2 hours' and pg.created_at >= now() - interval '48 hours'
    and not exists (select 1 from public.pagamentos outro where outro.user_id = pg.user_id and outro.status = 'aprovado' and outro.created_at >= pg.created_at)
    and pg.created_at = (select max(x.created_at) from public.pagamentos x where x.user_id = pg.user_id and x.status = 'pendente')
  limit limite;
$$;
revoke execute on function public.pagamentos_abandonados(int) from public, anon, authenticated;

create function public.pro_expirados(limite int default 100)
returns table (user_id uuid, email text, nome text, pro_ate timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, u.email::text, p.nome, p.pro_ate
  from public.perfis p join auth.users u on u.id = p.id
  where p.pro_ate <= now() and p.pro_ate >= now() - interval '48 hours'
    and (p.pro_expirou_aviso_para is null or p.pro_expirou_aviso_para <> p.pro_ate)
  limit limite;
$$;
revoke execute on function public.pro_expirados(int) from public, anon, authenticated;
