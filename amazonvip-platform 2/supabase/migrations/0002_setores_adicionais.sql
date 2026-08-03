-- =========================================================================
-- Amazon Vip · Plataforma Interna — módulos adicionais dos setores
-- Execute este arquivo DEPOIS do 0001_init.sql no SQL Editor do Supabase.
-- =========================================================================

-- ---------------------------------------------------------------------
-- ENSINO
-- ---------------------------------------------------------------------
create table if not exists public.ensino_turmas (
  id uuid primary key default gen_random_uuid(),
  curso_titulo text not null,
  data_inicio date,
  data_fim date,
  vagas integer default 0,
  inscritos integer default 0,
  status text not null default 'planejada' check (status in ('planejada','em_andamento','concluida')),
  created_at timestamptz not null default now()
);

create table if not exists public.ensino_materiais (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  tipo text default 'apostila' check (tipo in ('apostila','video','link','outro')),
  curso_titulo text,
  link text,
  created_at timestamptz not null default now()
);

create table if not exists public.ensino_certificados (
  id uuid primary key default gen_random_uuid(),
  aluno_nome text not null,
  curso_titulo text not null,
  data_emissao date,
  status text not null default 'pendente' check (status in ('pendente','emitido')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- MARKETING
-- ---------------------------------------------------------------------
create table if not exists public.marketing_calendario (
  id uuid primary key default gen_random_uuid(),
  data date not null default current_date,
  canal text,
  titulo text not null,
  status text not null default 'planejado' check (status in ('planejado','publicado')),
  created_at timestamptz not null default now()
);

create table if not exists public.marketing_inventario (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  categoria text,
  quantidade integer not null default 0,
  minimo integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.marketing_solicitacoes (
  id uuid primary key default gen_random_uuid(),
  solicitante text not null,
  item text not null,
  descricao text,
  status text not null default 'pendente' check (status in ('pendente','em_andamento','atendida')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SKIPTRAVEL
-- ---------------------------------------------------------------------
create table if not exists public.skiptravel_operacoes (
  id uuid primary key default gen_random_uuid(),
  pacote text not null,
  data_saida date,
  responsavel text,
  status text not null default 'planejada' check (status in ('planejada','em_andamento','concluida','cancelada')),
  created_at timestamptz not null default now()
);

create table if not exists public.skiptravel_parceiros (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text,
  contato text,
  created_at timestamptz not null default now()
);

create table if not exists public.skiptravel_tarefas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  status text not null default 'pendente' check (status in ('pendente','em_andamento','concluida')),
  prazo date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- FINANCEIRO (empresa)
-- ---------------------------------------------------------------------
create table if not exists public.financeiro_centros_custo (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  responsavel text,
  created_at timestamptz not null default now()
);

create table if not exists public.financeiro_contas (
  id uuid primary key default gen_random_uuid(),
  banco text not null,
  agencia text,
  conta text,
  saldo_inicial numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CÓDIGO TARIFÁRIO
-- ---------------------------------------------------------------------
create table if not exists public.tarifario_processos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  status text not null default 'pendente' check (status in ('pendente','em_andamento','concluida')),
  responsavel text,
  created_at timestamptz not null default now()
);

create table if not exists public.tarifario_tabela (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  descricao text,
  valor numeric(12,2) default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.tarifario_historico (
  id uuid primary key default gen_random_uuid(),
  data date not null default current_date,
  codigo text,
  descricao_alteracao text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- AMAZONVIP
-- ---------------------------------------------------------------------
create table if not exists public.amazonvip_clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  email text,
  origem text,
  status text not null default 'lead' check (status in ('lead','cliente','inativo')),
  created_at timestamptz not null default now()
);

create table if not exists public.amazonvip_metas (
  id uuid primary key default gen_random_uuid(),
  vendedor text not null,
  mes text not null, -- formato 'YYYY-MM'
  meta_valor numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.amazonvip_comissoes (
  id uuid primary key default gen_random_uuid(),
  produto text not null,
  percentual numeric(5,2) not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- RLS: mesma regra "admin ou cargo do setor" aplicada às novas tabelas
-- =========================================================================
do $$
declare
  t record;
begin
  for t in
    select unnest(array['ensino_turmas','ensino_materiais','ensino_certificados']) as tbl, 'ensino' as role
    union all
    select unnest(array['marketing_calendario','marketing_inventario','marketing_solicitacoes']), 'marketing'
    union all
    select unnest(array['skiptravel_operacoes','skiptravel_parceiros','skiptravel_tarefas']), 'skiptravel'
    union all
    select unnest(array['financeiro_centros_custo','financeiro_contas']), 'financeiro'
    union all
    select unnest(array['tarifario_processos','tarifario_tabela','tarifario_historico']), 'tarifario'
    union all
    select unnest(array['amazonvip_clientes','amazonvip_metas','amazonvip_comissoes']), 'amazonvip'
  loop
    execute format('alter table public.%I enable row level security', t.tbl);
    execute format(
      'create policy %I on public.%I for all using (public.current_role_name() in (%L, %L)) with check (public.current_role_name() in (%L, %L))',
      t.tbl || '_acesso_setor', t.tbl, 'admin', t.role, 'admin', t.role
    );
  end loop;
end $$;
