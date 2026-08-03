# AmazonVip — Plataforma Interna

Plataforma interna (intranet) da Amazon Vip Viagens e Turismo, com login,
controle de acesso por cargo e os **7 setores totalmente funcionais**
(cadastro, listagem e atualização de status em todas as abas). Feita em
**Next.js 16** + **Supabase** (banco de dados + autenticação), pronta para
publicar na **Vercel**.

## Como funciona o controle de acesso

Cada colaborador tem uma conta com um **cargo** (`role`). O cargo `admin` vê
tudo e cria as demais contas. Os outros cargos correspondem 1:1 a um setor —
por exemplo, o cargo `financeiro` só acessa `/financeiro`. Isso é garantido
em duas camadas:

1. **Na aplicação** (`src/proxy.ts` + `src/lib/auth.ts`): redireciona quem
   tenta acessar um setor que não é o seu.
2. **No banco de dados** (Row Level Security no Supabase): mesmo que alguém
   burlasse a interface, o Postgres só devolve/aceita dados do setor
   permitido para aquele usuário. Isso está nos arquivos
   `supabase/migrations/0001_init.sql` e `0002_setores_adicionais.sql`.

## Setores incluídos

Todos os setores abaixo estão **100% funcionais** (dashboard inicial, listas
com dados reais do Supabase e formulários de cadastro em todas as abas).

| Setor | Rota | Abas |
|---|---|---|
| Flutuante | `/flutuante` | Início, Reservas, Tarefas, Clientes, Parceiros, Financeiro, Inventário, Tabela de Preços |
| Ensino | `/ensino` | Início, Cursos, Turmas, Materiais, Certificados |
| Marketing | `/marketing` | Início, Campanhas, Calendário Editorial, Inventário, Solicitações |
| SkipTravel | `/skiptravel` | Início, Inventário, Operações, Parceiros, Tarefas |
| Financeiro (empresa) | `/financeiro` | Início, Lançamentos, Centros de Custo, Contas Bancárias, Relatórios |
| Código Tarifário | `/tarifario` | Início, Tarefas, Processos, Tabela Tarifária, Histórico |
| AmazonVip (vendas) | `/amazonvip` | Início, Vendas, Clientes, Metas, Comissões |

Nada depende de ferramentas externas: cadastro de funcionários, cargos e
todos os dados de cada setor ficam dentro da própria plataforma.

## Configuração (passo a passo)

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o banco de dados no Supabase

No seu projeto Supabase, abra **SQL Editor** e execute, **nesta ordem**, os
dois arquivos:

1. `supabase/migrations/0001_init.sql` — tabelas principais, políticas de
   segurança (RLS) e a função auxiliar de verificação de cargo.
2. `supabase/migrations/0002_setores_adicionais.sql` — tabelas dos módulos
   adicionais de cada setor (turmas, calendário editorial, operações,
   centros de custo, tabela tarifária, metas, comissões etc.) e suas
   respectivas políticas de RLS.

### 3. Configurar variáveis de ambiente

Copie `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Preencha com os dados do seu projeto (**Project Settings → API**):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — **nunca** compartilhe ou exponha esta chave;
  ela só é usada no servidor para criar contas de funcionários.

### 4. Criar o primeiro administrador

1. No Supabase, vá em **Authentication → Users → Add user** e crie um
   usuário com e-mail e senha.
2. Copie o UUID desse usuário.
3. No **SQL Editor**, rode:

   ```sql
   insert into public.profiles (id, full_name, email, role)
   values ('COLE-O-UUID-AQUI', 'Seu Nome', 'seu@email.com', 'admin');
   ```

A partir daqui, todos os outros colaboradores são criados **direto pela
plataforma**, em **Admin → Usuários**.

### 5. Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000` e entre com a conta de administrador criada
no passo 4.

### 6. Publicar na Vercel

1. Suba este projeto para um repositório Git (GitHub, GitLab, etc.).
2. Na Vercel, importe o repositório.
3. Em **Environment Variables**, adicione as três variáveis do `.env.local`.
4. Deploy.

## Adicionando novas abas no futuro

Se um setor precisar de uma aba nova além das já entregues, o padrão é
sempre o mesmo (veja `src/app/flutuante/reservas/page.tsx` como modelo):

1. Adicione a tabela correspondente em `supabase/migrations/` (crie um novo
   arquivo `0003_....sql`) e a política de RLS.
2. Crie uma função em `actions.ts` do setor para inserir/atualizar dados
   (server action com `"use server"`).
3. Crie a página com uma lista (`Table`) + formulário de cadastro
   (`NewItemPanel`), e adicione o item correspondente em
   `src/lib/config/sectors.ts` (propriedade `nav`).

## Estrutura do projeto

```
src/
  app/
    login/            página e ações de login/logout
    admin/             painel do administrador (usuários, cargos)
    setores/           grade "voltar aos setores" (só admin)
    flutuante/         setor completo (referência)
    ensino/ marketing/ skiptravel/ financeiro/ tarifario/ amazonvip/
  components/          Sidebar, tabelas, cards, formulários reutilizáveis
  lib/
    config/sectors.ts  definição central de cargos, setores e menus
    config/accent.ts   cores de destaque por setor
    supabase/          clientes Supabase (browser/server/admin)
    auth.ts            checagem de sessão e cargo (Data Access Layer)
  proxy.ts             protege rotas por login e por cargo (antigo "middleware")
supabase/migrations/    schema SQL do banco de dados
```

## Observação sobre a versão do Next.js

Este projeto usa **Next.js 16**, que renomeou o arquivo `middleware.ts` para
`proxy.ts` (por isso o arquivo se chama `src/proxy.ts`, não
`src/middleware.ts`). Isso é esperado e correto para esta versão.
