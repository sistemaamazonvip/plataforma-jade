import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard, Card, EmptyState, StatusBadge } from "@/components/ui";

export default async function TarifarioHome() {
  const supabase = await createClient();
  const { data: tarefas } = await supabase.from("tarifario_tarefas").select("*");
  const rows = tarefas ?? [];
  const pendentes = rows.filter((t) => t.status === "pendente").length;
  const emAndamento = rows.filter((t) => t.status === "em_andamento").length;
  const concluidas = rows.filter((t) => t.status === "concluida").length;

  return (
    <div>
      <PageHeader title="Código Tarifário — Início" subtitle="Tarefas e processos do código tarifário" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="tag" value={String(pendentes)} label="Pendentes" accent="violet" />
        <StatCard icon="flow" value={String(emAndamento)} label="Em andamento" accent="violet" />
        <StatCard icon="check" value={String(concluidas)} label="Concluídas" accent="violet" />
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Tarefas recentes</h2>
        {rows.length === 0 ? (
          <EmptyState icon="tag" text="Nenhuma tarefa cadastrada ainda." />
        ) : (
          <div className="flex flex-col gap-3">
            {rows.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-200">{t.titulo}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
