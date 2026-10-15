-- Cookies da Meta no checkout, pro evento de Compra (já aplicado)
alter table public.pagamentos add column meta_contexto jsonb;
