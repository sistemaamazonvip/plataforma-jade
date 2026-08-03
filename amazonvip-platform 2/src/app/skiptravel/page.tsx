import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard, Card, EmptyState } from "@/components/ui";

export default async function SkipTravelHome() {
  const supabase = await createClient();
  const { data: inventario } = await supabase.from("skiptravel_inventario").select("*");
  const rows = inventario ?? [];
  const vagasTotal = rows.reduce((s, r) => s + Number(r.vagas_total ?? 0), 0);
  const vagasDisp = rows.reduce((s, r) => s + Number(r.vagas_disponiveis ?? 0), 0);

  return (
    <div>
      <PageHeader title="SkipTravel — Início" subtitle="Inventário e operações de viagens" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="suitcase" value={String(rows.length)} label="Pacotes cadastrados" accent="cyan" />
        <StatCard icon="box" value={String(vagasTotal)} label="Vagas totais" accent="cyan" />
        <StatCard icon="check" value={String(vagasDisp)} label="Vagas disponíveis" accent="cyan" />
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Próximas saídas</h2>
        {rows.length === 0 ? (
          <EmptyState icon="suitcase" text="Nenhum pacote cadastrado ainda." />
        ) : (
          <div className="flex flex-col gap-3">
            {rows.slice(0, 6).map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-200">{r.pacote}</span>
                <span className="text-xs text-neutral-500">{r.data_saida} · {r.vagas_disponiveis}/{r.vagas_total} vagas</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
