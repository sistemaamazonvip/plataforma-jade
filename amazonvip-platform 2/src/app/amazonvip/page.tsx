import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard, Card, EmptyState } from "@/components/ui";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function AmazonVipHome() {
  const supabase = await createClient();
  const { data: vendas } = await supabase.from("amazonvip_vendas").select("*");
  const rows = vendas ?? [];
  const confirmadas = rows.filter((v) => v.status === "confirmada");
  const totalVendido = confirmadas.reduce((s, v) => s + Number(v.valor ?? 0), 0);

  return (
    <div>
      <PageHeader title="AmazonVip — Início" subtitle="Lançamento e controle de vendas" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="cart" value={String(rows.length)} label="Vendas lançadas" accent="orange" />
        <StatCard icon="check" value={String(confirmadas.length)} label="Confirmadas" accent="orange" />
        <StatCard icon="dollar" value={fmtBRL(totalVendido)} label="Total vendido" accent="orange" />
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Vendas recentes</h2>
        {rows.length === 0 ? (
          <EmptyState icon="cart" text="Nenhuma venda lançada ainda." />
        ) : (
          <div className="flex flex-col gap-3">
            {rows.slice(0, 6).map((v) => (
              <div key={v.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-200">{v.cliente} · {v.produto}</span>
                <span className="text-xs text-neutral-500">{fmtBRL(Number(v.valor))}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
