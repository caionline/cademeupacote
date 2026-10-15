-- "A loja respondeu. E agora?" (já aplicado no projeto aolyvifrskdhdftgrbkd)
alter table public.caso_eventos drop constraint caso_eventos_tipo_check;
alter table public.caso_eventos add constraint caso_eventos_tipo_check
  check (tipo in ('enviado', 'resolvido', 'nao_resolveu', 'reaberto', 'texto_gerado', 'prazo_vencido', 'loja_respondeu'));
