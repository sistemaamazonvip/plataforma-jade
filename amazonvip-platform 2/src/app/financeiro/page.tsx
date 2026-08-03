import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard, Card, EmptyState } from "@/components/ui";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function FinanceiroSetorHome() {
  const supabase = await createClient();
  const { data: lancamentos } = await supabase.from("financeiro_lancamentos").select("*");
  const rows = lancamentos ?? [];
  const entradas = rows.filter((r) => r.tipo === "entrada").reduce((s, r) => s + Number(r.valor), 0);
  const saidas = rows.filter((r) => r.tipo === "saida").reduce((s, r) => s + Number(r.valor), 0);
  const saldo = entradas - saidas;

  const porBanco: Record<string, number> = {};
  for (const r of rows) {
    const banco = r.banco || "Sem banco";
    const delta = r.tipo === "entrada" ? Number(r.valor) : -Number(r.valor);
    porBanco[banco] = (porBanco[banco] ?? 0) + delta;
  }

  return (
    <div>
      <PageHeader title="Financeiro — Início" subtitle="Lançamentos por centro de custo e bancos" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="dollar" value={fmtBRL(entradas)} label="Total de entradas" accent="emerald" />
        <StatCard icon="dollar" value={fmtBRL(saidas)} label="Total de saídas" accent="emerald" />
        <StatCard icon="bank" value={fmtBRL(saldo)} label="Saldo consolidado" accent="emerald" />
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Saldo por banco</h2>
        {Object.keys(porBanco).length === 0 ? (
          <EmptyState icon="bank" text="Nenhum lançamento cadastrado ainda." />
        ) : (
          <div className="flex flex-col gap-3">
            {Object.entries(porBanco).map(([banco, saldo]) => (
              <div key={banco} className="flex items-center justify-between text-sm">
                <span className="text-neutral-200">{banco}</span>
                <span className="font-medium text-neutral-100">{fmtBRL(saldo)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
