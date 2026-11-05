-- =====================================================================
-- Instituição Ana Prado — depoimentos
-- Tabela, administradores e regras de segurança (Row Level Security).
--
-- Regras:
--   • Público (anon): pode INSERIR depoimentos apenas com status 'pending'
--     e consentimento marcado; pode LER apenas os 'approved'.
--   • Administradores (usuários listados em public.admins): leem, aprovam,
--     rejeitam e excluem qualquer depoimento.
-- =====================================================================

-- ---------- Depoimentos ----------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(btrim(name)) between 1 and 80),
  relation    text check (relation is null or char_length(relation) <= 120),
  message     text not null check (char_length(btrim(message)) between 20 and 2000),
  language    text not null default 'pt' check (language in ('pt', 'es', 'en')),
  consent     boolean not null check (consent = true),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz
);

create index if not exists testimonials_status_created_idx
  on public.testimonials (status, created_at desc);

-- ---------- Administradores ----------
-- Só quem estiver nesta tabela pode moderar. Assim, mesmo que alguém
-- consiga criar uma conta no Auth, ela não terá acesso ao /admin.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- Sem políticas em "admins": ninguém lê/escreve pela API pública.
-- Inclua administradores pelo SQL Editor (veja o README).

-- Função usada pelas políticas e pelo site (rpc 'is_admin').
-- SECURITY DEFINER para poder consultar "admins" apesar do RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Row Level Security ----------
alter table public.testimonials enable row level security;

drop policy if exists "Público envia depoimentos pendentes" on public.testimonials;
create policy "Público envia depoimentos pendentes"
  on public.testimonials for insert
  to anon, authenticated
  with check (status = 'pending' and consent = true and reviewed_at is null);

drop policy if exists "Público lê depoimentos aprovados" on public.testimonials;
create policy "Público lê depoimentos aprovados"
  on public.testimonials for select
  to anon, authenticated
  using (status = 'approved' or (select public.is_admin()));

drop policy if exists "Admins atualizam depoimentos" on public.testimonials;
create policy "Admins atualizam depoimentos"
  on public.testimonials for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins excluem depoimentos" on public.testimonials;
create policy "Admins excluem depoimentos"
  on public.testimonials for delete
  to authenticated
  using ((select public.is_admin()));

-- Permissões de tabela (o RLS acima filtra as linhas).
-- O público só pode preencher estas colunas ao inserir:
revoke all on public.testimonials from anon, authenticated;
grant select on public.testimonials to anon, authenticated;
grant insert (name, relation, message, language, consent) on public.testimonials to anon, authenticated;
grant update (status, reviewed_at), delete on public.testimonials to authenticated;
