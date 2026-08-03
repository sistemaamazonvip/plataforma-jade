// Definição central de cargos (roles) e setores da plataforma.
// Cada colaborador tem exatamente um "role". O role "admin" vê tudo.
// Os demais roles correspondem 1:1 a um setor e só veem a própria aba.

export type SectorSlug =
  | "flutuante"
  | "ensino"
  | "marketing"
  | "skiptravel"
  | "financeiro"
  | "tarifario"
  | "amazonvip";

export type Role = "admin" | SectorSlug;

export interface NavItem {
  label: string;
  href: string; // caminho relativo dentro do setor, "" = página inicial do setor
  icon: string; // nome do ícone (chave em icons.tsx)
}

export interface SectorConfig {
  slug: SectorSlug;
  role: Role;
  name: string;
  shortDescription: string;
  icon: string;
  accent: string; // classe tailwind de destaque
  nav: NavItem[];
  /** true = a página ainda é um placeholder "em construção" */
  placeholderPages?: string[];
}

export const SECTORS: SectorConfig[] = [
  {
    slug: "flutuante",
    role: "flutuante",
    name: "Flutuante",
    shortDescription: "Hospedagem flutuante, cabines e embarcações",
    icon: "boat",
    accent: "amber",
    nav: [
      { label: "Início", href: "", icon: "home" },
      { label: "Reservas", href: "reservas", icon: "calendar" },
      { label: "Tarefas", href: "tarefas", icon: "tasks" },
      { label: "Clientes", href: "clientes", icon: "users" },
      { label: "Parceiros", href: "parceiros", icon: "handshake" },
      { label: "Financeiro", href: "financeiro", icon: "dollar" },
      { label: "Inventário", href: "inventario", icon: "box" },
      { label: "Tabela de Preços", href: "precos", icon: "tag" },
    ],
  },
  {
    slug: "ensino",
    role: "ensino",
    name: "Ensino",
    shortDescription: "Cursos, turmas e materiais didáticos",
    icon: "cap",
    accent: "sky",
    nav: [
      { label: "Início", href: "", icon: "home" },
      { label: "Cursos", href: "cursos", icon: "cap" },
      { label: "Turmas", href: "turmas", icon: "users" },
      { label: "Materiais", href: "materiais", icon: "doc" },
      { label: "Certificados", href: "certificados", icon: "check" },
    ],
  },
  {
    slug: "marketing",
    role: "marketing",
    name: "Marketing",
    shortDescription: "Campanhas, conteúdo e inventário promocional",
    icon: "megaphone",
    accent: "fuchsia",
    nav: [
      { label: "Início", href: "", icon: "home" },
      { label: "Campanhas", href: "campanhas", icon: "megaphone" },
      { label: "Calendário Editorial", href: "calendario", icon: "calendar" },
      { label: "Inventário", href: "inventario", icon: "box" },
      { label: "Solicitações", href: "solicitacoes", icon: "inbox" },
    ],
  },
  {
    slug: "skiptravel",
    role: "skiptravel",
    name: "SkipTravel",
    shortDescription: "Inventário e operações de viagens",
    icon: "suitcase",
    accent: "cyan",
    nav: [
      { label: "Início", href: "", icon: "home" },
      { label: "Inventário", href: "inventario", icon: "box" },
      { label: "Operações", href: "operacoes", icon: "route" },
      { label: "Parceiros", href: "parceiros", icon: "handshake" },
      { label: "Tarefas", href: "tarefas", icon: "tasks" },
    ],
  },
  {
    slug: "financeiro",
    role: "financeiro",
    name: "Financeiro",
    shortDescription: "Lançamentos por centro de custo, bancos e saldos",
    icon: "dollar",
    accent: "emerald",
    nav: [
      { label: "Início", href: "", icon: "home" },
      { label: "Lançamentos", href: "lancamentos", icon: "receipt" },
      { label: "Centros de Custo", href: "centros-de-custo", icon: "layers" },
      { label: "Contas Bancárias", href: "contas", icon: "bank" },
      { label: "Relatórios", href: "relatorios", icon: "chart" },
    ],
  },
  {
    slug: "tarifario",
    role: "tarifario",
    name: "Código Tarifário",
    shortDescription: "Tarefas e processos do código tarifário",
    icon: "tag",
    accent: "violet",
    nav: [
      { label: "Início", href: "", icon: "home" },
      { label: "Tarefas", href: "tarefas", icon: "tasks" },
      { label: "Processos", href: "processos", icon: "flow" },
      { label: "Tabela Tarifária", href: "tabela", icon: "table" },
      { label: "Histórico", href: "historico", icon: "history" },
    ],
  },
  {
    slug: "amazonvip",
    role: "amazonvip",
    name: "AmazonVip",
    shortDescription: "Lançamento e controle de vendas",
    icon: "cart",
    accent: "orange",
    nav: [
      { label: "Início", href: "", icon: "home" },
      { label: "Vendas", href: "vendas", icon: "cart" },
      { label: "Clientes", href: "clientes", icon: "users" },
      { label: "Metas", href: "metas", icon: "target" },
      { label: "Comissões", href: "comissoes", icon: "percent" },
    ],
  },
];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  ...Object.fromEntries(SECTORS.map((s) => [s.role, s.name])),
} as Record<Role, string>;

export function getSectorBySlug(slug: string): SectorConfig | undefined {
  return SECTORS.find((s) => s.slug === slug);
}

export function getSectorByRole(role: string): SectorConfig | undefined {
  return SECTORS.find((s) => s.role === role);
}

export function canAccessSector(role: Role, slug: SectorSlug): boolean {
  return role === "admin" || role === slug;
}

export const ALL_ROLES: Role[] = ["admin", ...SECTORS.map((s) => s.role)];
