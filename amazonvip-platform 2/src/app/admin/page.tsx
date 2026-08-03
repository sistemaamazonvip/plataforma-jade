import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SECTORS } from "@/lib/config/sectors";
import { getAccent } from "@/lib/config/accent";
import { PageHeader, Card, StatCard } from "@/components/ui";
import { Icon } from "@/components/icons";

export default async function AdminHome() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id, role, active");

  const rows = profiles ?? [];
  const total = rows.length;
  const ativos = rows.filter((p) => p.active).length;
  const countByRole = (role: string) => rows.filter((p) => p.role === role).length;

  return (
    <div>
      <PageHeader title="Administração" subtitle="Visão geral da plataforma" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="users" value={String(total)} label="Colaboradores cadastrados" />
        <StatCard icon="check" value={String(ativos)} label="Contas ativas" />
        <StatCard icon="grid" value={String(SECTORS.length)} label="Setores" />
      </div>

      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-300">Gestão de funcionários</h2>
          <Link href="/admin/usuarios" className="text-sm text-amber-400 hover:text-amber-300">
            Ver todos →
          </Link>
        </div>
        <p className="text-sm text-neutral-500">
          Crie contas de colaboradores e defina o cargo de cada um. O cargo determina qual
          setor a pessoa vê ao entrar na plataforma.
        </p>
      </Card>

      <h2 className="text-sm font-semibold text-neutral-300 mb-4">Setores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTORS.map((s) => {
          const a = getAccent(s.accent);
          return (
            <Link key={s.slug} href={`/${s.slug}`}>
              <Card className="hover:border-neutral-700 transition h-full">
                <div className={`w-9 h-9 rounded-lg ${a.iconGradient} flex items-center justify-center mb-3`}>
                  <Icon name={s.icon} size={17} className="text-neutral-950" />
                </div>
                <div className="font-medium text-neutral-100 text-sm mb-1">{s.name}</div>
                <div className="text-xs text-neutral-500 mb-2">{s.shortDescription}</div>
                <div className="text-xs text-neutral-600">{countByRole(s.role)} colaborador(es)</div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
