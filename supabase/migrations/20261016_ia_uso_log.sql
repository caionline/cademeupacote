-- Registro de tokens de cada chamada de IA, pro painel (já aplicado no projeto aolyvifrskdhdftgrbkd)
create table public.ia_uso_log (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  tipo          text not null check (tipo in ('reclamacao', 'prints', 'analise', 'proximo_texto')),
  modelo        text not null,
  input_tokens  int not null,
  output_tokens int not null
);
create index ia_uso_log_created_idx on public.ia_uso_log (created_at);
alter table public.ia_uso_log enable row level security;
