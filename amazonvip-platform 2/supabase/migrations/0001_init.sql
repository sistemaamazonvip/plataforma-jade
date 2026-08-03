-- =========================================================================
-- Amazon Vip · Plataforma Interna — schema inicial
-- Execute este arquivo no SQL Editor do seu projeto Supabase (Database > SQL Editor)
-- =========================================================================

-- ---------------------------------------------------------------------
-- 1. PERFIS (profiles) — cada usuário do Supabase Auth tem 1 perfil
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in (
    'admin','flutuante','ensino','marketing','skiptravel','financeiro','tarifario','amazonvip'
  )),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Função auxiliar: retorna o role do usuário autenticado (evita recursão de RLS)
create or replace function public.current_role_name()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create policy "usuário vê o próprio perfil" on public.profiles
  for select using (id = auth.uid());

create policy "admin vê todos os perfis" on public.profiles
  for select using (public.current_role_name() = 'admin');

create policy "admin atualiza perfis" on public.profiles
  for update using (public.current_role_name() = 'admin');

-- Perfis são criados via API administrativa (service role), não pelo cliente.
create policy "admin insere perfis" on public.profiles
  for insert with check (public.current_role_name() = 'admin');

create policy "admin remove perfis" on public.profiles
  for delete using (public.current_role_name() = 'admin');

-- ---------------------------------------------------------------------
-- Helper genérico de política: admin OU dono do setor
-- (repetido por tabela pois Postgres não permite parametrizar policies)
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- 2. FLUTUANTE
-- ---------------------------------------------------------------------
create table if not exists public.flutuante_reservas (
  id uuid primary key default gen_random_uuid(),
  cliente_nome text not null,
  contato text,
  cabine text,
  checkin date,
  checkout date,
  valor numeric(12,2) default 0,
  status text not null default 'negociando' check (status in ('confirmada','negociando','concluida','cancelada')),
  observacoes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.flutuante_tarefas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  responsavel text,
  status text not null default 'pendente' check (status in ('pendente','em_andamento','concluida')),
  prazo date,
  created_at timestamptz not null default now()
);

create table if not exists public.flutuante_clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  email text,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.flutuante_parceiros (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text,
  contato text,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.flutuante_financeiro (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  tipo text not null check (tipo in ('entrada','saida')),
  categoria text,
  valor numeric(12,2) not null default 0,
  data date not null default current_date,
  status text not null default 'pendente' check (status in ('pago','pendente')),
  created_at timestamptz not null default now()
);

create table if not exists public.flutuante_inventario (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  categoria text,
  quantidade integer not null default 0,
  unidade text default 'un',
  minimo integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.flutuante_precos (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  descricao text,
  valor numeric(12,2) not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. ENSINO
-- ---------------------------------------------------------------------
create table if not exists public.ensino_cursos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  carga_horaria integer,
  status text not null default 'ativo' check (status in ('ativo','encerrado','planejado')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. MARKETING
-- ---------------------------------------------------------------------
create table if not exists public.marketing_campanhas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  canal text,
  status text not null default 'planejada' check (status in ('planejada','ativa','concluida','pausada')),
  data_inicio date,
  data_fim date,
  orcamento numeric(12,2) default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. SKIPTRAVEL
-- ---------------------------------------------------------------------
create table if not exists public.skiptravel_inventario (
  id uuid primary key default gen_random_uuid(),
  pacote text not null,
  data_saida date,
  vagas_total integer not null default 0,
  vagas_disponiveis integer not null default 0,
  valor numeric(12,2) default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 6. FINANCEIRO (setor)
-- ---------------------------------------------------------------------
create table if not exists public.financeiro_lancamentos (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  centro_custo text,
  banco text,
  tipo text not null check (tipo in ('entrada','saida')),
  valor numeric(12,2) not null default 0,
  data date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 7. CÓDIGO TARIFÁRIO
-- ---------------------------------------------------------------------
create table if not exists public.tarifario_tarefas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  status text not null default 'pendente' check (status in ('pendente','em_andamento','concluida')),
  prazo date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 8. AMAZONVIP (vendas)
-- ---------------------------------------------------------------------
create table if not exists public.amazonvip_vendas (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  produto text not null,
  valor numeric(12,2) not null default 0,
  vendedor text,
  data date not null default current_date,
  status text not null default 'confirmada' check (status in ('confirmada','pendente','cancelada')),
  created_at timestamptz not null default now()
);

-- =========================================================================
-- RLS: habilita e cria política "admin ou cargo do setor" para cada tabela
-- =========================================================================
do $$
declare
  t record;
  sector_role text;
begin
  for t in
    select unnest(array[
      'flutuante_reservas','flutuante_tarefas','flutuante_clientes','flutuante_parceiros',
      'flutuante_financeiro','flutuante_inventario','flutuante_precos'
    ]) as tbl, 'flutuante' as role
    union all
    select unnest(array['ensino_cursos']), 'ensino'
    union all
    select unnest(array['marketing_campanhas']), 'marketing'
    union all
    select unnest(array['skiptravel_inventario']), 'skiptravel'
    union all
    select unnest(array['financeiro_lancamentos']), 'financeiro'
    union all
    select unnest(array['tarifario_tarefas']), 'tarifario'
    union all
    select unnest(array['amazonvip_vendas']), 'amazonvip'
  loop
    execute format('alter table public.%I enable row level security', t.tbl);
    execute format(
      'create policy %I on public.%I for all using (public.current_role_name() in (%L, %L)) with check (public.current_role_name() in (%L, %L))',
      t.tbl || '_acesso_setor', t.tbl, 'admin', t.role, 'admin', t.role
    );
  end loop;
end $$;

-- =========================================================================
-- Índices úteis
-- =========================================================================
create index if not exists idx_flutuante_reservas_status on public.flutuante_reservas(status);
create index if not exists idx_flutuante_reservas_checkin on public.flutuante_reservas(checkin);
create index if not exists idx_financeiro_lancamentos_data on public.financeiro_lancamentos(data);
create index if not exists idx_amazonvip_vendas_data on public.amazonvip_vendas(data);

-- =========================================================================
-- Como criar o PRIMEIRO administrador:
-- 1. Rode este arquivo no SQL Editor do Supabase.
-- 2. Crie um usuário em Authentication > Users > Add user (defina e-mail e senha).
-- 3. Copie o UUID desse usuário e rode:
--    insert into public.profiles (id, full_name, email, role)
--    values ('COLE-O-UUID-AQUI', 'Seu Nome', 'seu@email.com', 'admin');
-- A partir daí, você faz login na plataforma e cria os demais funcionários
-- direto pelo painel de administração (Admin > Usuários).
-- =========================================================================
