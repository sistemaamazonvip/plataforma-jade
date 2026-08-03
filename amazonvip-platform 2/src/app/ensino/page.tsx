import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard, Card, EmptyState } from "@/components/ui";

export default async function EnsinoHome() {
  const supabase = await createClient();
  const { data: cursos } = await supabase.from("ensino_cursos").select("*");
  const rows = cursos ?? [];
  const ativos = rows.filter((c) => c.status === "ativo").length;
  const planejados = rows.filter((c) => c.status === "planejado").length;

  return (
    <div>
      <PageHeader title="Ensino — Início" subtitle="Cursos e capacitação da equipe" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="cap" value={String(rows.length)} label="Cursos cadastrados" accent="sky" />
        <StatCard icon="check" value={String(ativos)} label="Cursos ativos" accent="sky" />
        <StatCard icon="calendar" value={String(planejados)} label="Planejados" accent="sky" />
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Cursos recentes</h2>
        {rows.length === 0 ? (
          <EmptyState icon="cap" text="Nenhum curso cadastrado ainda." />
        ) : (
          <div className="flex flex-col gap-3">
            {rows.slice(0, 6).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-200">{c.titulo}</span>
                <span className="text-xs text-neutral-500">{c.carga_horaria ? `${c.carga_horaria}h` : ""}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
