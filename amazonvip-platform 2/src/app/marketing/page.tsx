import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard, Card, EmptyState, StatusBadge } from "@/components/ui";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function MarketingHome() {
  const supabase = await createClient();
  const { data: campanhas } = await supabase.from("marketing_campanhas").select("*");
  const rows = campanhas ?? [];
  const ativas = rows.filter((c) => c.status === "ativa").length;
  const orcamentoTotal = rows.reduce((s, c) => s + Number(c.orcamento ?? 0), 0);

  return (
    <div>
      <PageHeader title="Marketing — Início" subtitle="Campanhas e gestão de inventário" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="megaphone" value={String(rows.length)} label="Campanhas cadastradas" accent="fuchsia" />
        <StatCard icon="check" value={String(ativas)} label="Ativas" accent="fuchsia" />
        <StatCard icon="dollar" value={fmtBRL(orcamentoTotal)} label="Orçamento total" accent="fuchsia" />
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Campanhas recentes</h2>
        {rows.length === 0 ? (
          <EmptyState icon="megaphone" text="Nenhuma campanha cadastrada ainda." />
        ) : (
          <div className="flex flex-col gap-3">
            {rows.slice(0, 6).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-200">{c.titulo}</span>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
